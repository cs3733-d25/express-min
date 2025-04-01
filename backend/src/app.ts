import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import express from "express";

const prisma = new PrismaClient();
const port = 3000;
const app = express();

app.use(bodyParser.json());

app.get("/api/employees/:id", async (request, response) => {
  response.json(
    await prisma.employee.findUniqueOrThrow({
      where: {
        id: Number(request.params.id),
      },
    }),
  );
});

app.get("/api/employees", async (_, response) => {
  response.json(await prisma.employee.findMany());
});

app.post("/api/employees", async (request, response) => {
  await prisma.employee.create({
    data: request.body,
  });

  response.sendStatus(200);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
