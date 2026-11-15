# Zylo Solution — Website + Admin Panel

Company website and admin panel for **Zylo Solution** (ERP & software company, Manama, Bahrain).
Next.js 15 (App Router, TypeScript) serves the frontend and backend on **one port**. Data lives in MongoDB (Mongoose).

| Area | Tech |
|---|---|
| UI | Tailwind CSS, Framer Motion, GSAP + Flip (loaded only for the intro), lucide-react |
| Data | MongoDB + Mongoose (local or Atlas, same code) |
| Auth | Single admin, bcrypt hash in env, JWT in httpOnly cookie, middleware-protected `/admin` + `/api/admin` |
| Email | Nodemailer (SMTP) |
| Push | Web Push (VAPID) + service worker `public/sw.js` |
| Uploads | Cloudinary (only URLs stored in MongoDB) |

---

## 1. Run locally

**Prerequisites:** Node.js 20+ and MongoDB running locally (`mongodb://127.0.0.1:27017`), or a MongoDB Atlas connection string.

```bash
npm install
cp .env.example .env.local          # then fill in the values (see below)
npm run hash-password -- "YourStrongPassword"   # paste ADMIN_PASSWORD_HASH + JWT_SECRET into .env.local
npm run generate-vapid-keys                       # paste VAPID keys into .env.local
npm run seed                        # services, products, sample projects, blog posts, settings
npm run dev                         # http://localhost:3000   admin: http://localhost:3000/admin
```

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run dev:lan` | Development server reachable from phones on the same Wi‑Fi (prints the `http://192.168.x.x:3000` address) |
| `npm run start:lan` | Same for the production build (after `npm run build`) |
| `npm run build` / `npm start` | Production build / server (port 3000) |
| `npm run seed` | Inserts missing seed content (never overwrites your edits) |
| `npm run seed:reset` | Resets seeded content to the bundled version (bookings untouched) |
| `npm run generate-vapid-keys` | New Web Push key pair |
| `npm run hash-password -- "pw"` | bcrypt hash for `ADMIN_PASSWORD_HASH` + a fresh `JWT_SECRET` |
| `npm run placeholders` | Generates placeholder images for any missing image file |
| `npm run illustrations` | Re-renders all brand illustrations (`scripts/illustrations/`) into `public/images/` |
| `npm run typecheck` | TypeScript check |

> **`$` in `.env` files:** Next.js expands `$VAR` in env files, so bcrypt hashes must be written with `\$` (the hash script prints that form). In the Vercel dashboard, PM2 or Docker `-e`, paste the **raw** hash.

> **No database?** The public site still works: if MongoDB is unreachable, pages fall back to the bundled seed content. Bookings and the admin panel need the database.

### Environment variables (`.env.example`)

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes | e.g. `https://zylosolution.com` (canonical URLs, sitemap, OG, email links). Baked in at build time. |
| `MONGODB_URI` | yes | Local or Atlas URI |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `JWT_SECRET` | yes | Admin login |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | for email | Without them, bookings still save; emails are skipped and logged |
| `BOOKING_NOTIFY_EMAIL` | optional | Defaults to `Info@zylosolution.com` |
| `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` | for push | `npm run generate-vapid-keys` |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER` | for uploads | Without them, paste image URLs/paths in the admin instead |

---

## 2. Test the booking, email and push flow

1. **Booking:** open `/book-demo` (or click any *Book a Demo* button for the modal), fill the form, submit → animated success state.
   - It is saved in MongoDB with status `new` and appears in **Admin → Bookings**. The bell badge updates within 15 seconds (instantly if push is on).
   - Spam protection: zod validation, hidden honeypot field, minimum fill time, and a rate limit of 5 requests per 10 minutes per IP.
2. **Email:** set the `SMTP_*` values (Gmail: create an *App password* and use `smtp.gmail.com`, port 465, `SMTP_SECURE=true`). Submit a booking:
   - `BOOKING_NOTIFY_EMAIL` receives the full details plus an *Open in admin* button.
   - The customer receives an automatic confirmation.
   - Failures are logged and never block the booking.
3. **Push:**
   - Log in at `/admin` and click **Enable notifications**. Allow the browser prompt; the subscription is stored in MongoDB.
   - Click **Notifications on** (top bar) or **Send test notification** (Settings) to test.
   - Submit a booking from another tab or phone. You get *"New demo request from {name}"*, and clicking it opens `/admin/bookings/{id}`.
   - Push works on `http://localhost` and on HTTPS. On iPhone it requires iOS 16.4+ and the admin added to the Home Screen.
4. **Health:** `GET /api/health` returns DB status and which integrations are configured.

---

## 3. Admin panel (`/admin`)

- **Overview:** counts and latest bookings.
- **Bookings:** search, filter by status, change status, internal notes, delete, unread bell.
- **Services / Products / Our Work / Blog:** add, edit and delete; drag-and-drop ordering; publish toggle; image upload; SEO fields with a Google preview; markdown editor with preview; FAQ editor.
- **Settings:** phone, email, WhatsApp, address, hours, social links, homepage stats.

Saving content refreshes the public pages immediately (on-demand revalidation, plus a 60-second ISR fallback).

---

## 4. Deploy (A): DEMO on Vercel + MongoDB Atlas (free) + Cloudinary

1. **MongoDB Atlas:**
   1. Create a free **M0** cluster.
   2. *Database Access*: add a database user with a password and the *Read and write to any database* role.
   3. *Network Access*: add `0.0.0.0/0`. Vercel uses dynamic IPs, so the strong password is your protection.
   4. *Connect → Drivers*: copy the URI and insert the user, password and database name, e.g. `mongodb+srv://zylo:PASS@cluster0.xxxx.mongodb.net/zylo?retryWrites=true&w=majority`.
2. **Seed Atlas from your computer:** put that URI in `.env.local` as `MONGODB_URI` and run `npm run seed`.
3. **Cloudinary:** sign up and copy the Cloud name, API key and API secret from the dashboard.
4. **Vercel:**
   1. Push the repo to GitHub and import it in Vercel (framework is detected automatically).
   2. Add **all** variables from `.env.example` under *Settings → Environment Variables*.
   3. Use the **raw** bcrypt hash (no backslashes).
   4. Set `NEXT_PUBLIC_SITE_URL` to your Vercel or custom domain URL.
   5. Deploy.
5. **Push needs HTTPS**, which Vercel provides automatically. After deploying, log in to `/admin` on each device and click **Enable notifications** again.
6. Optional: add your domain under *Settings → Domains*, update `NEXT_PUBLIC_SITE_URL` and redeploy.

> On Vercel the in-memory rate limiter works per serverless instance; the honeypot and timing checks still apply.

---

## 5. Deploy (B): PRODUCTION on an Ubuntu VPS (Node + PM2 + Nginx + Certbot)

```bash
# 1. System packages
sudo apt update && sudo apt install -y nginx git
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt install -y nodejs
sudo npm i -g pm2

# 2. App
sudo mkdir -p /var/www/zylo && sudo chown $USER /var/www/zylo
git clone <your-repo> /var/www/zylo && cd /var/www/zylo
cp .env.example .env.production && nano .env.production   # fill values; escape $ in the hash as \$
npm ci && npm run build
npm run seed            # reads .env.production (and .env.local if present)

# 3. Run with PM2 (single port 3000, bound to localhost)
pm2 start ecosystem.config.cjs && pm2 save && pm2 startup   # run the command pm2 prints

# 4. Nginx reverse proxy
sudo cp deploy/nginx.conf /etc/nginx/sites-available/zylosolution.com
sudo ln -s /etc/nginx/sites-available/zylosolution.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 5. Free SSL
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d zylosolution.com -d www.zylosolution.com --redirect

# 6. Firewall
sudo ufw allow OpenSSH && sudo ufw allow 'Nginx Full' && sudo ufw enable
```

**Updating:** `git pull && npm ci && npm run build && pm2 reload zylo`
**Health check / monitoring:** `curl https://zylosolution.com/api/health`
**MongoDB on the VPS:** install MongoDB Community Server and use `mongodb://127.0.0.1:27017/zylo`, or keep using Atlas (add the VPS IP to Atlas *Network Access*).

### Docker (alternative)

```bash
docker build --build-arg NEXT_PUBLIC_SITE_URL=https://zylosolution.com -t zylo .
docker run -d --name zylo --restart unless-stopped -p 127.0.0.1:3000:3000 --env-file .env.production zylo
```

Keep Nginx and Certbot in front exactly as above. In `--env-file`, write the hash **without** backslashes.

---

## 6. Images & brand

- **Logo:** your original file is kept at `brand/zylo-logo-original.jpg`. Generated from it:
  - `public/logo.png`: trimmed logo, used in JSON-LD
  - `public/og.png`: 1200×630 social share image
  - `public/icon.png` and `public/apple-icon.png`: "Z." favicon and push-notification icon
- **Wordmark:** the header and footer logo is live text, a bold "Zylo" with the yellow dot (`src/components/brand/Wordmark.tsx`). It is black on light backgrounds and white in the black footer.
- **Colours:**
  - White background, black text (#0B0B0F), blue for actions and links (#2541F5), yellow accents (#FFC914)
  - Neutral colours are CSS variables in `src/app/globals.css`. Wrapping any block in `className="theme-dark"` turns it black, as the footer and hero dashboard do.
  - Yellow is used for fills and highlights only, never as body text, so contrast stays readable.
- **Illustrations:** every service, product, case study and blog cover is a vector illustration in the brand colours.
  - Each one is drawn in code in `scripts/illustrations/`; editable SVG copies are in `brand/illustrations/`.
  - Change text, numbers or colours there, then run `npm run illustrations` to regenerate the JPGs in `public/images/`.
  - To use a photo instead, overwrite the JPG with the same name, or upload a new image in the admin panel.
- **Unused images:** the three earlier dark-navy illustrations (`public/images/*_isometric.png`) are no longer used and can be deleted.

## 7. SEO & GEO

- Per-page title, description, canonical, Open Graph and Twitter tags.
- `sitemap.xml` and `robots.txt` (blocks `/admin` and `/api`).
- Breadcrumbs with BreadcrumbList schema.
- JSON-LD: Organization, ProfessionalService/LocalBusiness, WebSite, Service, FAQPage, Article.
- `/llms.txt` and `/llms-full.txt` are generated from the live content.
- Every service and product page has an answer-first summary, a "Who is this for?" block, a feature list and FAQs (editable in the admin).

## 8. Project structure

```
src/
  app/(site)/…        public pages (home, services, products, work, about, blog, contact, book-demo)
  app/admin/…         login + panel (overview, bookings, settings, generic [resource] list/editor)
  app/api/…           bookings, auth, health, push, admin CRUD (generic [resource]), upload
  app/sitemap.ts, robots.ts, llms.txt/, llms-full.txt/
  components/         layout, home, booking, intro, cards, detail, admin, ui, seo
  data/               seed content (also the offline fallback)
  lib/                db, content, auth, mail, push, cloudinary, seo, validators, rate-limit
  models/             Mongoose models
scripts/              seed, hash-password, generate-vapid-keys, generate-placeholders
deploy/nginx.conf, Dockerfile, ecosystem.config.cjs
```
