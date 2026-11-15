import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { SITE, absoluteUrl } from "@/lib/site";
import { escapeHtml, formatDate } from "@/lib/utils";
import type { BookingDoc } from "@/types";

let transporter: Transporter | null = null;

export function isMailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransporter() {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 465);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

const from = () => process.env.SMTP_FROM || `${SITE.name} <${process.env.SMTP_USER}>`;

function layout(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#f4f6fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px"><tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden">
    <tr><td style="background:#ffffff;padding:24px 28px;border-bottom:4px solid #2541F5">
      <span style="font-size:30px;font-weight:800;letter-spacing:-1px;color:#0B0B0F">Zylo</span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:#FFC914;margin-left:2px"></span>
    </td></tr>
    <tr><td style="padding:28px">
      <h1 style="font-size:20px;margin:0 0 16px">${title}</h1>
      ${body}
    </td></tr>
    <tr><td style="padding:18px 28px;background:#f8fafc;font-size:12px;color:#64748b">
      ${SITE.name} · Manama, Bahrain · ${SITE.phone} · ${SITE.email}
    </td></tr>
  </table></td></tr></table></body></html>`;
}

function rows(b: BookingDoc) {
  const items: [string, string | undefined][] = [
    ["Name", b.name],
    ["Company", b.company],
    ["Email", b.email],
    ["Phone / WhatsApp", b.phone],
    ["Service", b.service],
    ["Preferred date", b.preferredDate ? formatDate(b.preferredDate, { dateStyle: "full" }) : ""],
    ["Preferred time", b.preferredTime],
    ["Message", b.message],
  ];
  return `<table cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px">${items
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="border-bottom:1px solid #e2e8f0;color:#64748b;width:38%;vertical-align:top">${k}</td><td style="border-bottom:1px solid #e2e8f0;white-space:pre-wrap">${escapeHtml(v!)}</td></tr>`,
    )
    .join("")}</table>`;
}

export async function sendBookingEmails(booking: BookingDoc & { _id: string }) {
  if (!isMailConfigured()) {
    console.warn("[mail] SMTP not configured – skipping booking emails");
    return { skipped: true };
  }
  const t = getTransporter();
  const to = process.env.BOOKING_NOTIFY_EMAIL || SITE.email;
  const adminUrl = absoluteUrl(`/admin/bookings/${booking._id}`);

  const internal = t.sendMail({
    from: from(),
    to,
    replyTo: booking.email,
    subject: `New demo request from ${booking.name}${booking.company ? ` (${booking.company})` : ""}`,
    text: `New demo request\n\nName: ${booking.name}\nCompany: ${booking.company}\nEmail: ${booking.email}\nPhone: ${booking.phone}\nService: ${booking.service}\nDate: ${booking.preferredDate}\nTime: ${booking.preferredTime}\n\n${booking.message}\n\nOpen: ${adminUrl}`,
    html: layout(
      "New demo request",
      `${rows(booking)}<p style="margin:24px 0 0"><a href="${adminUrl}" style="background:#2541F5;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:bold">Open in admin panel</a></p>`,
    ),
  });

  const confirmation = t.sendMail({
    from: from(),
    to: booking.email,
    replyTo: to,
    subject: `We received your demo request – ${SITE.name}`,
    text: `Hi ${booking.name},\n\nThank you for booking a demo with ${SITE.name}. Our team in Manama will contact you within one business day to confirm the time.\n\nNeed us sooner? WhatsApp or call ${SITE.phone}.\n\n${SITE.name}`,
    html: layout(
      `Thanks, ${escapeHtml(booking.name.split(" ")[0])}. Your demo request is in.`,
      `<p style="font-size:15px;line-height:1.6">Our team in Manama will contact you <strong>within one business day</strong> to confirm your demo time.</p>
       <p style="font-size:15px;line-height:1.6">Here is a copy of your request:</p>${rows(booking)}
       <p style="font-size:15px;line-height:1.6;margin-top:24px">Need us sooner? WhatsApp or call <a href="https://wa.me/${SITE.whatsapp}" style="color:#2541F5">${SITE.phone}</a>.</p>`,
    ),
  });

  const [a, b] = await Promise.allSettled([internal, confirmation]);
  if (a.status === "rejected") console.error("[mail] internal notification failed:", a.reason);
  if (b.status === "rejected") console.error("[mail] customer confirmation failed:", b.reason);
  return { internal: a.status, confirmation: b.status };
}
