import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // First user gets admin + reviewer roles
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      id: "seed-admin-1",
      email: "admin@example.com",
      name: "Admin User",
      roles: ["admin", "reviewer"],
      isActive: true,
    },
  });

  const reviewer = await prisma.user.upsert({
    where: { email: "reviewer@example.com" },
    update: {},
    create: {
      id: "seed-reviewer-1",
      email: "reviewer@example.com",
      name: "Reviewer One",
      roles: ["reviewer"],
      isActive: true,
    },
  });

  // Create some reviews for the reviewer
  const now = new Date();
  
  await prisma.review.create({
    data: {
      reviewerId: reviewer.id,
      dateReviewed: now,
      durationMinutes: 120,
      videoType: "team",
      notes: "Seed review team",
    },
  });

  await prisma.review.create({
    data: {
      reviewerId: reviewer.id,
      dateReviewed: now,
      durationMinutes: 60,
      videoType: "individual",
      notes: "Seed review individual",
    },
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
