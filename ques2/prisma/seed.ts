import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = [
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Emma",
    "Frank",
    "Grace",
    "Hannah",
    "Ian",
    "Jack",
    "Karen",
    "Leo",
    "Mia",
    "Nathan",
    "Olivia",
    "Paul",
    "Quinn",
    "Rachel",
    "Steve",
    "Tina",
  ];

  // Insert users into the database
  await prisma.user.createMany({
    data: users.map((name) => ({ name })),
    skipDuplicates: true, // Avoid duplicates on re-run
  });

  console.log("✅ Seeded 20 users successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding users:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
