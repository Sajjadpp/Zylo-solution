import type { ProjectDoc } from "@/types";

/** Sample case studies – flagged `sample: true` so they are labelled on the site. Replace from the admin panel. */
export const projectsSeed: ProjectDoc[] = [
  {
    title: "Odoo ERP Rollout for a Multi-Branch Trading Company",
    slug: "odoo-erp-multi-branch-trading",
    client: "Sample: Building materials trader",
    industry: "Trading & Distribution",
    country: "Bahrain",
    description:
      "A building materials trader with four branches in Bahrain replaced spreadsheets and a legacy accounting package with Odoo ERP covering sales, purchasing, inventory and accounting.",
    challenge:
      "Each branch kept its own stock spreadsheet. Head office could not see real stock levels, month-end closing took two weeks, and VAT returns were prepared manually.",
    solution:
      "Zylo Solution implemented Odoo Sales, Purchase, Inventory and Accounting with inter-branch transfers, bilingual tax invoices, and a migration of 6,000 products and 1,200 customers. Staff in every branch were trained on their own workflows before go-live.",
    results: [
      "Month-end closing reduced from 14 days to 4 days",
      "Live stock visibility across all four branches",
      "VAT returns generated directly from the system",
      "Go-live in 10 weeks",
    ],
    tech: ["Odoo Sales", "Odoo Inventory", "Odoo Accounting", "Data Migration", "Arabic Reports"],
    coverImage: "/images/work/odoo-erp-multi-branch-trading.jpg",
    gallery: [],
    year: 2025,
    featured: true,
    sample: true,
    sortOrder: 1,
    published: true,
    seoTitle: "Odoo ERP Case Study: Multi-Branch Trader in Bahrain",
    seoDescription:
      "How Zylo Solution rolled out Odoo ERP across four branches of a Bahrain trading company, cutting month-end closing from 14 to 4 days.",
  },
  {
    title: "Warehouse Barcode System for a Retail Chain",
    slug: "warehouse-barcode-retail-chain",
    client: "Sample: Consumer electronics retailer",
    industry: "Retail",
    country: "Saudi Arabia",
    description:
      "A consumer electronics retailer with a central warehouse and 12 stores introduced barcode scanning for receiving, transfers, serial number tracking and cycle counts.",
    challenge:
      "Stock-takes required closing stores for a full day, serial numbers were recorded on paper, and transfer errors between the warehouse and stores were common.",
    solution:
      "We deployed the Zylo Barcoding System on Android handheld scanners, integrated with the retailer's Odoo ERP. Every product and bin received a bilingual label, and stores moved to daily cycle counts.",
    results: [
      "Inventory accuracy improved to over 99%",
      "Full-store closures for stock-takes eliminated",
      "Serial numbers captured for every unit sold",
      "Transfer errors reduced by around 80%",
    ],
    tech: ["Zylo Barcoding System", "Odoo Inventory", "Android Handhelds", "Label Printing"],
    coverImage: "/images/work/warehouse-barcode-retail-chain.jpg",
    gallery: [],
    year: 2024,
    featured: true,
    sample: true,
    sortOrder: 2,
    published: true,
    seoTitle: "Barcode Inventory Case Study: Retail Chain in Saudi Arabia",
    seoDescription:
      "How a 12-store retailer used Zylo Solution's barcode inventory system to reach over 99% stock accuracy and end full-day stock-takes.",
  },
  {
    title: "Offline Van Sales App for an FMCG Distributor",
    slug: "offline-van-sales-fmcg-distributor",
    client: "Sample: Food and beverage distributor",
    industry: "FMCG Distribution",
    country: "UAE",
    description:
      "A food and beverage distributor equipped 25 van salespeople with the Zylo Van Sale Module for ordering, invoicing, collections and van stock control.",
    challenge:
      "Drivers wrote invoices by hand, office staff re-typed them the next morning, and cash collections often did not match van stock at the end of the day.",
    solution:
      "We rolled out the Van Sale Module on Android devices with Bluetooth printers. The app works offline, syncs with Odoo when connected, enforces customer credit limits and produces an end-of-day reconciliation per van.",
    results: [
      "Same-day visibility of all field sales",
      "Next-morning data entry eliminated",
      "Cash and stock discrepancies reduced significantly",
      "Around 15% more customer visits per route",
    ],
    tech: ["Zylo Van Sale Module", "Odoo Sales", "Offline Sync", "Route Planning", "Bluetooth Printing"],
    coverImage: "/images/work/offline-van-sales-fmcg-distributor.jpg",
    gallery: [],
    year: 2024,
    featured: true,
    sample: true,
    sortOrder: 3,
    published: true,
    seoTitle: "Van Sales App Case Study: FMCG Distributor in the UAE",
    seoDescription:
      "How 25 van salespeople moved from paper invoices to Zylo Solution's offline van sales app, with same-day visibility of field sales.",
  },
];
