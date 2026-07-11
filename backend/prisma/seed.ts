import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Card Types ─────────────────────────────────────────────────────────────
  const cardTypes = [
    { name: 'Amazon Gift Card', brand: 'amazon', logo: '/logos/amazon.svg' },
    { name: 'Apple iTunes Gift Card', brand: 'apple', logo: '/logos/apple.svg' },
    { name: 'Google Play Gift Card', brand: 'google_play', logo: '/logos/google-play.svg' },
    { name: 'Steam Gift Card', brand: 'steam', logo: '/logos/steam.svg' },
    { name: 'Netflix Gift Card', brand: 'netflix', logo: '/logos/netflix.svg' },
    { name: 'Walmart Gift Card', brand: 'walmart', logo: '/logos/walmart.svg' },
    { name: 'Target Gift Card', brand: 'target', logo: '/logos/target.svg' },
    { name: 'Best Buy Gift Card', brand: 'bestbuy', logo: '/logos/bestbuy.svg' },
    { name: 'eBay Gift Card', brand: 'ebay', logo: '/logos/ebay.svg' },
    { name: 'Visa Gift Card', brand: 'visa', logo: '/logos/visa.svg' },
    { name: 'Mastercard Gift Card', brand: 'mastercard', logo: '/logos/mastercard.svg' },
    { name: 'American Express Gift Card', brand: 'amex', logo: '/logos/amex.svg' },
  ];

  for (const ct of cardTypes) {
    await prisma.cardType.upsert({
      where: { brand: ct.brand },
      update: {},
      create: { ...ct, active: true },
    });
  }
  console.log(`✅ Seeded ${cardTypes.length} card types`);

  // ─── Default Settings ────────────────────────────────────────────────────────
  const defaultSettings = [
    { key: 'site_name', value: 'GiftCard Verify' },
    { key: 'site_tagline', value: 'Instant Gift Card Balance Verification' },
    { key: 'max_daily_requests_per_ip', value: '50' },
    { key: 'verification_timeout_ms', value: '30000' },
    { key: 'active_provider', value: 'mock' },
    { key: 'maintenance_mode', value: 'false' },
    { key: 'contact_email', value: 'support@giftcardverify.com' },
  ];

  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log(`✅ Seeded ${defaultSettings.length} default settings`);

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
