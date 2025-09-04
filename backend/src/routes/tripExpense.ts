import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middlewares/authMiddleware";

export async function tripExpenseRoutes(app: FastifyInstance) {
  const paramsSchema = z.object({ id: z.coerce.number() });
  const tripIdSchema = z.object({ tripId: z.coerce.number() });
  
  const expenseBodySchema = z.object({
    description: z.string().min(1, "Descrição é obrigatória"),
    amount: z.coerce.number().min(0.01, "Valor deve ser maior que zero"),
    date: z.string().transform((str) => new Date(str)),
    category: z.string().min(1, "Categoria é obrigatória"),
    notes: z.string().optional(),
    tripId: z.coerce.number() // adicionei tripId para criar despesa vinculada
  });

  app.addHook("preHandler", authenticate);

  // Listar todas as despesas (com filtros opcionais)
  app.get("/expenses", async (req, rep) => {
    try {
      const { tripId, category, startDate, endDate } = z.object({
        tripId: z.coerce.number().optional(),
        category: z.string().optional(),
        startDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
        endDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
      }).parse(req.query);

      const where: any = {};
      if (tripId) where.tripId = tripId;
      if (category) where.category = category;
      if (startDate && endDate) {
        where.date = { gte: startDate, lte: endDate };
      }

      const expenses = await prisma.tripExpense.findMany({
        where,
        include: {
          trip: {
            select: {
              id: true,
              destination: true,
              driver: true,
              date: true,
              truck: { select: { id: true, name: true, plate: true } }
            }
          }
        },
        orderBy: { date: "desc" }
      });

      return { expenses };
    } catch (error) {
      console.error("Erro ao listar despesas:", error);
      return rep.code(500).send({ message: "Erro ao listar despesas" });
    }
  });

  // Listar despesas de uma viagem específica
  app.get("/trips/:tripId/expenses", async (req, rep) => {
    try {
      const { tripId } = tripIdSchema.parse(req.params);

      const trip = await prisma.trip.findUnique({ where: { id: tripId } });
      if (!trip) return rep.code(404).send({ message: "Viagem não encontrada" });

      const expenses = await prisma.tripExpense.findMany({
        where: { tripId },
        orderBy: { date: "desc" }
      });

      return { expenses };
    } catch (error) {
      console.error("Erro ao listar despesas da viagem:", error);
      return rep.code(500).send({ message: "Erro ao listar despesas da viagem" });
    }
  });

  // Buscar despesa por ID
  app.get("/expenses/:id", async (req, rep) => {
    try {
      const { id } = paramsSchema.parse(req.params);
      const expense = await prisma.tripExpense.findUniqueOrThrow({
        where: { id },
        include: {
          trip: {
            select: {
              id: true,
              destination: true,
              driver: true,
              date: true,
              truck: { select: { id: true, name: true, plate: true } }
            }
          }
        }
      });
      return expense;
    } catch (error: any) {
      console.error("Erro ao buscar despesa:", error);
      if (error.code === "P2025") {
        return rep.code(404).send({ message: "Despesa não encontrada" });
      }
      return rep.code(500).send({ message: "Erro ao buscar despesa" });
    }
  });

  // Criar despesa
  app.post("/expenses", async (req, rep) => {
    try {
      const data = expenseBodySchema.parse(req.body);

      const trip = await prisma.trip.findUnique({ where: { id: data.tripId } });
      if (!trip) return rep.code(400).send({ message: "Viagem não encontrada" });

      const expense = await prisma.tripExpense.create({
        data,
        include: {
          trip: {
            select: {
              id: true,
              destination: true,
              driver: true,
              date: true,
              truck: { select: { id: true, name: true, plate: true } }
            }
          }
        }
      });

      return rep.code(201).send(expense);
    } catch (error) {
      console.error("Erro ao criar despesa:", error);
      return rep.code(500).send({ message: "Erro ao criar despesa" });
    }
  });

  // Atualizar despesa
  app.put("/expenses/:id", async (req, rep) => {
    try {
      const { id } = paramsSchema.parse(req.params);
      const data = expenseBodySchema.parse(req.body);

      const existingExpense = await prisma.tripExpense.findUnique({ where: { id } });
      if (!existingExpense) return rep.code(404).send({ message: "Despesa não encontrada" });

      if (data.tripId !== existingExpense.tripId) {
        const trip = await prisma.trip.findUnique({ where: { id: data.tripId } });
        if (!trip) return rep.code(400).send({ message: "Viagem não encontrada" });
      }

      const expense = await prisma.tripExpense.update({
        where: { id },
        data,
        include: {
          trip: {
            select: {
              id: true,
              destination: true,
              driver: true,
              date: true,
              truck: { select: { id: true, name: true, plate: true } }
            }
          }
        }
      });

      return expense;
    } catch (error) {
      console.error("Erro ao atualizar despesa:", error);
      return rep.code(500).send({ message: "Erro ao atualizar despesa" });
    }
  });

  // Deletar despesa
  app.delete("/expenses/:id", async (req, rep) => {
    try {
      const { id } = paramsSchema.parse(req.params);

      const expense = await prisma.tripExpense.findUnique({ where: { id } });
      if (!expense) return rep.code(404).send({ message: "Despesa não encontrada" });

      await prisma.tripExpense.delete({ where: { id } });
      return rep.code(204).send();
    } catch (error) {
      console.error("Erro ao deletar despesa:", error);
      return rep.code(500).send({ message: "Erro ao deletar despesa" });
    }
  });

  // Resumo de despesas
  app.get("/expenses/summary", async (req, rep) => {
    try {
      const { tripId, category, startDate, endDate } = z.object({
        tripId: z.coerce.number().optional(),
        category: z.string().optional(),
        startDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
        endDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
      }).parse(req.query);

      const where: any = {};
      if (tripId) where.tripId = tripId;
      if (category) where.category = category;
      if (startDate && endDate) {
        where.date = { gte: startDate, lte: endDate };
      }

      const expenses = await prisma.tripExpense.findMany({ where });

      const totalExpenses = expenses.length;
      const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const averageAmount = totalExpenses > 0 ? totalAmount / totalExpenses : 0;

      const expensesByCategory = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {} as Record<string, number>);

      return {
        summary: {
          totalExpenses,
          totalAmount,
          averageAmount,
          expensesByCategory,
        },
        expenses: expenses.length,
      };
    } catch (error) {
      console.error("Erro ao gerar resumo de despesas:", error);
      return rep.code(500).send({ message: "Erro ao gerar resumo de despesas" });
    }
  });
}
