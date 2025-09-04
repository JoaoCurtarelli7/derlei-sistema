import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middlewares/authMiddleware";

export async function monthRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authenticate);

  // Schema para validação de mês
  const createMonthSchema = z.object({
    year: z.number().min(2020).max(2030),
    month: z.number().min(1).max(12),
  });

  const updateMonthSchema = z.object({
    status: z.enum(["aberto", "fechado", "cancelado"]).optional(),
  });

  // Listar todos os meses
  app.get("/months", async (req, rep) => {
    try {
      const { year, status } = req.query as { year?: string; status?: string };

      let whereClause: any = {};
      
      if (year) {
        whereClause.year = parseInt(year);
      }
      
      if (status) {
        whereClause.status = status;
      }

      const months = await prisma.month.findMany({
        where: whereClause,
        include: {
          closings: {
            include: {
              company: {
                select: {
                  id: true,
                  name: true,
                  cnpj: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: [
          { year: 'desc' },
          { month: 'desc' },
        ],
      });

      return rep.send(months);
    } catch (error) {
      console.error("Erro ao listar meses:", error);
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Obter mês específico
  app.get("/months/:id", async (req, rep) => {
    try {
      const { id } = z.object({ id: z.coerce.number() }).parse(req.params);

      const month = await prisma.month.findUnique({
        where: { id },
        include: {
          closings: {
            include: {
              company: {
                select: {
                  id: true,
                  name: true,
                  cnpj: true,
                },
              },
              entries: {
                orderBy: { date: 'desc' },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!month) {
        return rep.code(404).send({ message: "Mês não encontrado" });
      }

      return rep.send(month);
    } catch (error) {
      console.error("Erro ao obter mês:", error);
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Criar novo mês
  app.post("/months", async (req, rep) => {
    try {
      const { year, month } = createMonthSchema.parse(req.body);

      // Verificar se o mês já existe
      const existingMonth = await prisma.month.findUnique({
        where: {
          year_month: {
            year,
            month,
          },
        },
      });

      if (existingMonth) {
        return rep.code(400).send({ message: "Este mês já existe" });
      }

      // Nome do mês em português
      const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
      ];

      const monthName = `${monthNames[month - 1]} ${year}`;

      const newMonth = await prisma.month.create({
        data: {
          year,
          month,
          name: monthName,
        },
        include: {
          closings: true,
        },
      });

      return rep.code(201).send(newMonth);
    } catch (error) {
      console.error("Erro ao criar mês:", error);
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Atualizar mês
  app.put("/months/:id", async (req, rep) => {
    try {
      const { id } = z.object({ id: z.coerce.number() }).parse(req.params);
      const data = updateMonthSchema.parse(req.body);

      const updatedMonth = await prisma.month.update({
        where: { id },
        data,
        include: {
          closings: {
            include: {
              company: {
                select: {
                  id: true,
                  name: true,
                  cnpj: true,
                },
              },
            },
          },
        },
      });

      return rep.send(updatedMonth);
    } catch (error) {
      console.error("Erro ao atualizar mês:", error);
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Deletar mês (apenas se não tiver fechamentos)
  app.delete("/months/:id", async (req, rep) => {
    try {
      const { id } = z.object({ id: z.coerce.number() }).parse(req.params);

      // Verificar se o mês tem fechamentos
      const month = await prisma.month.findUnique({
        where: { id },
        include: {
          closings: true,
        },
      });

      if (!month) {
        return rep.code(404).send({ message: "Mês não encontrado" });
      }

      if (month.closings.length > 0) {
        return rep.code(400).send({ 
          message: "Não é possível deletar um mês que possui fechamentos" 
        });
      }

      await prisma.month.delete({
        where: { id },
      });

      return rep.send({ message: "Mês deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar mês:", error);
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Obter estatísticas do mês
  app.get("/months/:id/stats", async (req, rep) => {
    try {
      const { id } = z.object({ id: z.coerce.number() }).parse(req.params);

      const month = await prisma.month.findUnique({
        where: { id },
        include: {
          closings: {
            include: {
              entries: true,
            },
          },
        },
      });

      if (!month) {
        return rep.code(404).send({ message: "Mês não encontrado" });
      }

      // Calcular estatísticas
      const totalClosings = month.closings.length;
      const closedClosings = month.closings.filter(c => c.status === 'fechado').length;
      
      const allEntries = month.closings.flatMap(c => c.entries);
      const totalEntries = allEntries.filter(e => e.type === 'entrada').reduce((sum, e) => sum + e.amount, 0);
      const totalExpenses = allEntries.filter(e => e.type === 'saida').reduce((sum, e) => sum + e.amount, 0);
      const totalTaxes = allEntries.filter(e => e.type === 'imposto').reduce((sum, e) => sum + e.amount, 0);
      const balance = totalEntries - totalExpenses - totalTaxes;

      return rep.send({
        month: {
          id: month.id,
          name: month.name,
          year: month.year,
          month: month.month,
          status: month.status,
        },
        stats: {
          totalClosings,
          closedClosings,
          openClosings: totalClosings - closedClosings,
          totalEntries,
          totalExpenses,
          totalTaxes,
          balance,
          profitMargin: totalEntries > 0 ? (balance / totalEntries) * 100 : 0,
        },
      });
    } catch (error) {
      console.error("Erro ao obter estatísticas do mês:", error);
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });
}
