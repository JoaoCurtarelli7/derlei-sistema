import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middlewares/authMiddleware";

export async function tripExpenseRoutes(app: FastifyInstance) {
  const paramsSchema = z.object({ id: z.coerce.number(), tripId: z.coerce.number() });
  const bodySchema = z.object({
    description: z.string(),
    amount: z.coerce.number(),
    tripId: z.coerce.number(),
  });

  app.addHook("preHandler", authenticate);

  app.get("/trip-expenses/:tripId", async (req, rep) => {
    const { tripId } = paramsSchema.parse(req.params);
    try {
      const expenses = await prisma.tripExpense.findMany({ where: { tripId } });
      return expenses;
    } catch (error) {
      console.error(error);
      return rep.code(500).send({ message: "Erro ao listar despesas" });
    }
  });

  app.post("/trip-expenses", async (req, rep) => {
    const data = bodySchema.parse(req.body);
    try {
      const expense = await prisma.tripExpense.create({ data });
      return rep.code(201).send(expense);
    } catch (error) {
      console.error(error);
      return rep.code(500).send({ message: "Erro ao criar despesa" });
    }
  });

  app.put("/trip-expenses/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);
    const data = bodySchema.parse(req.body);

    try {
      const expense = await prisma.tripExpense.update({ where: { id }, data });
      return rep.send(expense);
    } catch (error) {
      console.error(error);
      return rep.code(500).send({ message: "Erro ao atualizar despesa" });
    }
  });

  app.delete("/trip-expenses/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);
    try {
      await prisma.tripExpense.delete({ where: { id } });
      return rep.code(204).send();
    } catch (error) {
      console.error(error);
      return rep.code(500).send({ message: "Erro ao deletar despesa" });
    }
  });
}
