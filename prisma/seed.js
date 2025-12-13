import prisma from "../lib/prisma.js";

async function main() {
  const packages = [
    { name: "Starter", amount: 50, position: 1 },
    { name: "Basic", amount: 100, position: 2 },
    { name: "Standard", amount: 250, position: 3 },
    { name: "Silver", amount: 500, position: 4 },
    { name: "Gold", amount: 1000, position: 5 },
    { name: "Platinum", amount: 2500, position: 6 },
    { name: "Diamond", amount: 5000, position: 7 },
    { name: "Elite", amount: 10000, position: 8 },
    { name: "Ultimate", amount: 20000, position: 9 },
  ];

  // clean for dev only
  await prisma.package.deleteMany();

  await prisma.package.createMany({
    data: packages,
  });

  console.log("✅ Packages seeded");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
