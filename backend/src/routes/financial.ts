import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middlewares/authMiddleware";

export async function financialRoutes(app: FastifyInstance) {
  // Aplicar autenticação em todas as rotas
  app.addHook("preHandler", authenticate);

  // Schema para validação de entrada financeira
  const createEntrySchema = z.object({
    description: z.string().min(3, "Descrição deve ter pelo menos 3 caracteres"),
    amount: z.number().positive("Valor deve ser maior que zero"),
    category: z.string().min(1, "Categoria é obrigatória"),
    date: z.string().transform((str) => new Date(str)),
    companyId: z.number().optional(),
    closingId: z.number().optional(),
    type: z.enum(["entrada", "saida", "imposto"]),
    observations: z.string().optional(),
  });

  // Schema para validação de período financeiro
  const createPeriodSchema = z.object({
    name: z.string().min(1, "Nome do período é obrigatório"),
    startDate: z.string().transform((str) => new Date(str)),
    endDate: z.string().transform((str) => new Date(str)),
    companyId: z.number().optional(),
  });

  // Schema para validação de filtros
  const filterSchema = z.object({
    startDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
    endDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
    companyId: z.number().optional(),
    type: z.enum(["entrada", "saida", "imposto"]).optional(),
    category: z.string().optional(),
  });

  // Criar nova entrada financeira
  app.post("/financial/entries", async (req, rep) => {
    try {
      const data = createEntrySchema.parse(req.body);
      
      const entry = await prisma.financialEntry.create({
        data: {
          description: data.description,
          amount: data.amount,
          category: data.category,
          date: data.date,
          companyId: data.companyId,
          type: data.type,
          observations: data.observations,
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              cnpj: true,
            },
          },
        },
      });

      return rep.code(201).send(entry);
    } catch (error) {
      console.error("Erro ao criar entrada financeira:", error);
      return rep.code(400).send({ 
        message: "Erro ao criar entrada financeira",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Listar entradas financeiras com filtros
  app.get("/financial/entries", async (req, rep) => {
    try {
      const { startDate, endDate, companyId, type, category } = filterSchema.parse(req.query);
      
      const where: any = {};
      
      if (startDate && endDate) {
        where.date = {
          gte: startDate,
          lte: endDate,
        };
      }
      
      if (companyId) {
        where.companyId = companyId;
      }
      
      if (type) {
        where.type = type;
      }
      
      if (category) {
        where.category = category;
      }

      const entries = await prisma.financialEntry.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              cnpj: true,
            },
          },
        },
        orderBy: {
          date: "desc",
        },
      });

      return { entries };
    } catch (error) {
      console.error("Erro ao buscar entradas financeiras:", error);
      return rep.code(400).send({ 
        message: "Erro ao buscar entradas financeiras",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Buscar entrada financeira por ID
  app.get("/financial/entries/:id", async (req, rep) => {
    try {
      const { id } = z.object({ id: z.coerce.number() }).parse(req.params);
      
      const entry = await prisma.financialEntry.findUnique({
        where: { id },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              cnpj: true,
            },
          },
        },
      });

      if (!entry) {
        return rep.code(404).send({ message: "Entrada financeira não encontrada" });
      }

      return entry;
    } catch (error) {
      console.error("Erro ao buscar entrada financeira:", error);
      return rep.code(400).send({ 
        message: "Erro ao buscar entrada financeira",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Atualizar entrada financeira
  app.put("/financial/entries/:id", async (req, rep) => {
    try {
      const { id } = z.object({ id: z.coerce.number() }).parse(req.params);
      const data = createEntrySchema.parse(req.body);
      
      const entry = await prisma.financialEntry.update({
        where: { id },
        data: {
          description: data.description,
          amount: data.amount,
          category: data.category,
          date: data.date,
          companyId: data.companyId,
          type: data.type,
          observations: data.observations,
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              cnpj: true,
            },
          },
        },
      });

      return entry;
    } catch (error) {
      console.error("Erro ao atualizar entrada financeira:", error);
      return rep.code(400).send({ 
        message: "Erro ao atualizar entrada financeira",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Deletar entrada financeira
  app.delete("/financial/entries/:id", async (req, rep) => {
    try {
      const { id } = z.object({ id: z.coerce.number() }).parse(req.params);
      
      await prisma.financialEntry.delete({
        where: { id },
      });

      return { message: "Entrada financeira deletada com sucesso" };
    } catch (error) {
      console.error("Erro ao deletar entrada financeira:", error);
      return rep.code(400).send({ 
        message: "Erro ao deletar entrada financeira",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Resumo financeiro por período
  app.get("/financial/summary", async (req, rep) => {
    try {
      const { startDate, endDate, companyId } = filterSchema.parse(req.query);
      
      if (!startDate || !endDate) {
        return rep.code(400).send({ 
          message: "Data de início e fim são obrigatórias para o resumo" 
        });
      }

      const where: any = {
        date: {
          gte: startDate,
          lte: endDate,
        },
      };
      
      if (companyId) {
        where.companyId = companyId;
      }

      const entries = await prisma.financialEntry.findMany({ where });
      
      const totalEntries = entries
        .filter(e => e.type === "entrada")
        .reduce((sum, e) => sum + e.amount, 0);
      
      const totalExpenses = entries
        .filter(e => e.type === "saida")
        .reduce((sum, e) => sum + e.amount, 0);
      
      const totalTaxes = entries
        .filter(e => e.type === "imposto")
        .reduce((sum, e) => sum + e.amount, 0);
      
      const balance = totalEntries - totalExpenses - totalTaxes;
      const profitMargin = totalEntries > 0 ? (balance / totalEntries) * 100 : 0;

      return {
        period: {
          startDate,
          endDate,
        },
        summary: {
          totalEntries,
          totalExpenses,
          totalTaxes,
          balance,
          profitMargin,
        },
        entries: entries.length,
      };
    } catch (error) {
      console.error("Erro ao gerar resumo financeiro:", error);
      return rep.code(400).send({ 
        message: "Erro ao gerar resumo financeiro",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Criar período financeiro
  app.post("/financial/periods", async (req, rep) => {
    try {
      const data = createPeriodSchema.parse(req.body);
      
      const period = await prisma.financialPeriod.create({
        data: {
          name: data.name,
          startDate: data.startDate,
          endDate: data.endDate,
          companyId: data.companyId,
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              cnpj: true,
            },
          },
        },
      });

      return rep.code(201).send(period);
    } catch (error) {
      console.error("Erro ao criar período financeiro:", error);
      return rep.code(400).send({ 
        message: "Erro ao criar período financeiro",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Listar períodos financeiros
  app.get("/financial/periods", async (req, rep) => {
    try {
      const { companyId } = filterSchema.parse(req.query);
      
      const where: any = {};
      if (companyId) {
        where.companyId = companyId;
      }

      const periods = await prisma.financialPeriod.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              cnpj: true,
            },
          },
        },
        orderBy: {
          startDate: "desc",
        },
      });

      return { periods };
    } catch (error) {
      console.error("Erro ao buscar períodos financeiros:", error);
      return rep.code(400).send({ 
        message: "Erro ao buscar períodos financeiros",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Fechar período financeiro
  app.post("/financial/periods/:id/close", async (req, rep) => {
    try {
      const { id } = z.object({ id: z.coerce.number() }).parse(req.params);
      
      const period = await prisma.financialPeriod.findUnique({
        where: { id },
        include: {
          company: true,
        },
      });

      if (!period) {
        return rep.code(404).send({ message: "Período financeiro não encontrado" });
      }

      // Calcular totais do período
      const entries = await prisma.financialEntry.findMany({
        where: {
          companyId: period.companyId,
          date: {
            gte: period.startDate,
            lte: period.endDate,
          },
        },
      });

      const totalEntries = entries
        .filter(e => e.type === "entrada")
        .reduce((sum, e) => sum + e.amount, 0);
      
      const totalExpenses = entries
        .filter(e => e.type === "saida")
        .reduce((sum, e) => sum + e.amount, 0);
      
      const totalTaxes = entries
        .filter(e => e.type === "imposto")
        .reduce((sum, e) => sum + e.amount, 0);
      
      const balance = totalEntries - totalExpenses - totalTaxes;
      const profitMargin = totalEntries > 0 ? (balance / totalEntries) * 100 : 0;

      // Atualizar período com totais
      const updatedPeriod = await prisma.financialPeriod.update({
        where: { id },
        data: {
          status: "fechado",
          totalEntries,
          totalExpenses,
          totalTaxes,
          balance,
          profitMargin,
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              cnpj: true,
            },
          },
        },
      });

      return updatedPeriod;
    } catch (error) {
      console.error("Erro ao fechar período financeiro:", error);
      return rep.code(400).send({ 
        message: "Erro ao fechar período financeiro",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });
}
