const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.group.createMany({
    data: [
      {
        id: 0,
        name: "Bénévole",
      },
      {
        id: 1,
        name: "Cadre",
      },
      {
        id: 2,
        name: "Logisticien",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
