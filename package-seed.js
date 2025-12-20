const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const packages = [
    { name: "Starter", amount: 25, position: 1 },
    { name: "Basic", amount: 50, position: 2 },
    { name: "Bronze", amount: 100, position: 3 },
    { name: "Silver", amount: 250, position: 4 },
    { name: "Gold", amount: 500, position: 5 },
    { name: "Platinum", amount: 1000, position: 6 },
    { name: "Diamond", amount: 2500, position: 7 },
    { name: "Elite", amount: 5000, position: 8 },
    { name: "Master", amount: 10000, position: 9 },
    { name: "Ultimate", amount: 20000, position: 10 },
  ];

  for (const pkg of packages) {
    const existing = await prisma.package.findFirst({
      where: { name: pkg.name },
    });

    if (existing) {
      // ✅ Update existing package
      await prisma.package.update({
        where: { id: existing.id },
        data: {
          amount: pkg.amount,
          position: pkg.position,
          isActive: true,
        },
      });

      console.log(`🔁 Updated package: ${pkg.name}`);
    } else {
      // ✅ Create new package
      await prisma.package.create({
        data: {
          name: pkg.name,
          amount: pkg.amount,
          position: pkg.position,
          isActive: true,
        },
      });

      console.log(`➕ Created package: ${pkg.name}`);
    }
  }

  console.log("✅ Package seed completed successfully");
}

main()
  .catch((err) => {
    console.error("❌ Package seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
