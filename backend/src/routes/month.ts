import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middlewares/authMiddleware";

export async function monthRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authenticate);

  const createMonthSchema = z.object({
    year: z.coerce.number().min(2020).max(2030),
    month: z.coerce.number().min(1).max(12),
  });

  const updateMonthSchema = z.object({
    status: z.enum(["aberto", "fechado", "cancelado"]).optional(),
  });

  // Listar meses
  app.get("/months", async (req, rep) => {
    try {
      const querySchema = z.object({
        year: z.string().optional(),
        status: z.string().optional(),
      });

      const { year, status } = querySchema.parse(req.query);

      let whereClause: any = {};

      if (year) {
        whereClause.year = parseInt(year);
      }

      if (status) {
        whereClause.status = status;
      }

      const months = await prisma.$queryRaw`
        SELECT * FROM Month 
        ORDER BY year DESC, month DESC
      `;

      return rep.send(months || []);
    } catch (error) {
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Obter mês por ID
  app.get("/months/:id", async (req, rep) => {
    try {
      const { id } = z.object({ id: z.coerce.number() }).parse(req.params);

      const month = await prisma.month.findUnique({
        where: { id },
        include: {
          closings: {
            include: {
              company: {
                select: { id: true, name: true, cnpj: true },
              },
              entries: true,
            },
          },
        },
      });

      if (!month) {
        return rep.code(404).send({ message: "Mês não encontrado" });
      }

      return rep.send(month);
    } catch (error) {
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Criar novo mês
  app.post("/months", async (req, rep) => {
    try {
      const body = req.body;
      const { year, month } = createMonthSchema.parse(body);

      // Verificar se o mês já existe (temporariamente desabilitado)
      // const existingMonth = await prisma.month.findMany({
      //   where: {
      //     year,
      //     month,
      //   },
      //   take: 1,
      // });

      // if (existingMonth.length > 0) {
      //   return rep.code(400).send({ message: "Este mês já existe" });
      // }

      const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
      ];

      const monthName = `${monthNames[month - 1]} ${year}`;

      const newMonth = await prisma.$queryRaw`
        INSERT INTO Month (year, month, name, status, createdAt, updatedAt) 
        VALUES (${year}, ${month}, ${monthName}, 'aberto', datetime('now'), datetime('now'))
      `;
      
      const createdMonth = await prisma.$queryRaw`
        SELECT * FROM Month 
        WHERE year = ${year} AND month = ${month}
        LIMIT 1
      ` as any[];

      return rep.code(201).send(createdMonth[0] || {});
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return rep.code(400).send({ 
          message: "Dados inválidos", 
          errors: error.errors 
        });
      }
      if (error instanceof Error) {
        return rep.code(400).send({ 
          message: "Erro ao criar mês", 
          error: error.message 
        });
      }
      return rep.code(500).send({ 
        message: "Erro interno do servidor",
        error: error?.message || 'Erro desconhecido'
      });
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
                select: { id: true, name: true, cnpj: true },
              },
            },
          },
        },
      });

      return rep.send(updatedMonth);
    } catch (error) {
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Deletar mês
  app.delete("/months/:id", async (req, rep) => {
    try {
      const { id } = z.object({ id: z.coerce.number() }).parse(req.params);

      const month = await prisma.month.findUnique({
        where: { id },
        include: { closings: true },
      });

      if (!month) {
        return rep.code(404).send({ message: "Mês não encontrado" });
      }

      if (month.closings.length > 0) {
        return rep.code(400).send({
          message: "Não é possível deletar um mês que possui fechamentos",
        });
      }

      await prisma.month.delete({ where: { id } });

      return rep.send({ message: "Mês deletado com sucesso" });
    } catch (error) {
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Estatísticas do mês
  app.get("/months/:id/stats", async (req, rep) => {
    try {
      const { id } = z.object({ id: z.coerce.number() }).parse(req.params);

      const month = await prisma.month.findUnique({
        where: { id },
        include: {
          closings: {
            include: { entries: true },
          },
        },
      });

      if (!month) {
        return rep.code(404).send({ message: "Mês não encontrado" });
      }

      const totalClosings = month.closings.length;
      const closedClosings = month.closings.filter(c => c.status === "fechado").length;

      const allEntries = month.closings.flatMap(c => c.entries);
      const totalEntries = allEntries.filter(e => e.type === "entrada").reduce((sum, e) => sum + e.amount, 0);
      const totalExpenses = allEntries.filter(e => e.type === "saida").reduce((sum, e) => sum + e.amount, 0);
      const totalTaxes = allEntries.filter(e => e.type === "imposto").reduce((sum, e) => sum + e.amount, 0);
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
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });
}
