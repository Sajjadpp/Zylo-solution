/**
 * Seeds MongoDB with services, products, sample projects, blog posts and settings.
 *
 *   npm run seed          → inserts anything missing (matched by slug); never overwrites your edits
 *   npm run seed:reset    → overwrites seeded documents with the bundled content (bookings are never touched)
 */
import { loadEnvConfig } from "@next/env";
import mongoose from "mongoose";

loadEnvConfig(process.cwd());

async function main() {
  const reset = process.argv.includes("--reset");
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set. Copy .env.example to .env.local first.");

  // Import after env is loaded.
  const { Service, Product, Project, Post, Settings } = await import("../src/models");
  const { servicesSeed } = await import("../src/data/services");
  const { productsSeed } = await import("../src/data/products");
  const { projectsSeed } = await import("../src/data/projects");
  const { postsSeed } = await import("../src/data/posts");
  const { settingsSeed } = await import("../src/data/settings");

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.log(`✔ Connected to ${mongoose.connection.host}/${mongoose.connection.name}`);

  const sets: [string, mongoose.Model<any>, { slug: string }[]][] = [ // eslint-disable-line @typescript-eslint/no-explicit-any
    ["services", Service, servicesSeed],
    ["products", Product, productsSeed],
    ["projects", Project, projectsSeed],
    ["posts", Post, postsSeed],
  ];

  for (const [name, Model, docs] of sets) {
    await Model.init(); // ensure unique indexes exist
    let inserted = 0;
    let updated = 0;
    for (const doc of docs) {
      if (reset) {
        const r = await Model.updateOne({ slug: doc.slug }, { $set: doc }, { upsert: true });
        if (r.upsertedCount) inserted++;
        else updated++;
      } else {
        const r = await Model.updateOne({ slug: doc.slug }, { $setOnInsert: doc }, { upsert: true });
        if (r.upsertedCount) inserted++;
      }
    }
    console.log(`✔ ${name.padEnd(9)} ${inserted} inserted${reset ? `, ${updated} reset` : ""} (${docs.length} in seed)`);
  }

  const existing = await Settings.findOne();
  if (!existing) {
    await Settings.create(settingsSeed);
    console.log("✔ settings  created");
  } else if (reset) {
    await Settings.updateOne({ _id: existing._id }, { $set: settingsSeed });
    console.log("✔ settings  reset");
  } else {
    console.log("✔ settings  already exist (kept)");
  }

  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD_HASH) {
    console.log('\n⚠ Admin login not configured yet. Run:  npm run hash-password -- "YourPassword"  and add the values to .env.local');
  } else {
    console.log(`\n✔ Admin login: ${process.env.ADMIN_EMAIL} (password from ADMIN_PASSWORD_HASH)`);
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch(async (err) => {
  console.error("✖ Seed failed:", err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
