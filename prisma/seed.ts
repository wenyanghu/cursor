import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const rooms = ["General", "Random", "Tech"];
  for (const name of rooms) {
    await prisma.room.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("Seeded rooms:", rooms.join(", "));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
