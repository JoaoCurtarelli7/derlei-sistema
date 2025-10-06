import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middlewares/authMiddleware";

export async function closingRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authenticate);

  // Schema para validação de fechamento
  const createClosingSchema = z.object({
    monthId: z.number(),
    companyId: z.number().optional(),
    name: z.string().min(1, "Nome do fechamento é obrigatório"),
    startDate: z.string().nullable().optional().transform((str) => {
      if (!str) return null;
      // Converter DD/MM/YYYY para Date
      const [day, month, year] = str.split('/');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }),
    endDate: z.string().nullable().optional().transform((str) => {
      if (!str) return null;
      // Converter DD/MM/YYYY para Date
      const [day, month, year] = str.split('/');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }),
  });

  const updateClosingSchema = z.object({
    name: z.string().min(1).optional(),
    startDate: z.string().nullable().transform((str) => {
      if (!str) return null;
      // Converter DD/MM/YYYY para Date
      const [day, month, year] = str.split('/');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }).optional(),
    endDate: z.string().nullable().transform((str) => {
      if (!str) return null;
      // Converter DD/MM/YYYY para Date
      const [day, month, year] = str.split('/');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }).optional(),
    status: z.enum(["aberto", "fechado", "cancelado"]).optional(),
  });

  // Listar fechamentos
  app.get("/closings", async (req, rep) => {
    try {
      const { monthId, companyId, status } = req.query as { 
        monthId?: string; 
        companyId?: string; 
        status?: string; 
      };

      let whereClause: any = {};
      
      if (monthId) {
        whereClause.monthId = parseInt(monthId);
      }
      
      if (companyId) {
        whereClause.companyId = parseInt(companyId);
      }
      
      if (status) {
        whereClause.status = status;
      }

      let closings;
      if (monthId) {
        closings = await prisma.$queryRaw`
          SELECT 
            c.*,
            m.name as monthName,
            m.year as monthYear,
            m.month as monthNumber,
            comp.name as companyName,
            comp.cnpj as companyCnpj
          FROM Closing c
          LEFT JOIN Month m ON c.monthId = m.id
          LEFT JOIN Company comp ON c.companyId = comp.id
          WHERE c.monthId = ${parseInt(monthId)}
          ORDER BY c.createdAt DESC
        ` as any[];
      } else {
        closings = await prisma.$queryRaw`
          SELECT 
            c.*,
            m.name as monthName,
            m.year as monthYear,
            m.month as monthNumber,
            comp.name as companyName,
            comp.cnpj as companyCnpj
          FROM Closing c
          LEFT JOIN Month m ON c.monthId = m.id
          LEFT JOIN Company comp ON c.companyId = comp.id
          ORDER BY c.createdAt DESC
        ` as any[];
      }

      return rep.send(closings);
    } catch (error: any) {
      return rep.code(500).send({ 
        message: "Erro interno do servidor",
        error: error?.message || 'Erro desconhecido'
      });
    }
  });

  // Obter fechamento específico
  app.get("/closings/:id", async (req, rep) => {
    try {
      const { id } = z.object({ id: z.coerce.number() }).parse(req.params);

      const closing = await prisma.closing.findUnique({
        where: { id },
        include: {
          month: {
            select: {
              id: true,
              name: true,
              year: true,
              month: true,
            },
          },
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
      });

      if (!closing) {
        return rep.code(404).send({ message: "Fechamento não encontrado" });
      }

      return rep.send(closing);
    } catch (error) {
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Criar novo fechamento
  app.post("/closings", async (req, rep) => {
    try {
      const data = createClosingSchema.parse(req.body);

      // Verificar se o mês existe
      const month = await prisma.$queryRaw`
        SELECT * FROM Month WHERE id = ${data.monthId}
      ` as any[];

      if (month.length === 0) {
        return rep.code(404).send({ message: "Mês não encontrado" });
      }

      // Verificar se a empresa existe (se fornecida)
      if (data.companyId) {
        const company = await prisma.$queryRaw`
          SELECT * FROM Company WHERE id = ${data.companyId}
        ` as any[];

        if (company.length === 0) {
          return rep.code(404).send({ message: "Empresa não encontrada" });
        }
      }

      // Criar fechamento usando Prisma ORM em vez de SQL bruto
      const closingData = {
        monthId: data.monthId,
        companyId: data.companyId || null,
        name: data.name,
        status: 'aberto',
        startDate: data.startDate || null,
        endDate: data.endDate || null,
      };
      
      const newClosing = await prisma.closing.create({
        data: closingData,
        include: {
          month: {
            select: {
              id: true,
              name: true,
              year: true,
              month: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
              cnpj: true,
            },
          },
        },
      });

      return rep.code(201).send(newClosing);
    } catch (error) {
      console.error("Erro ao criar fechamento:", error);
      return rep.code(500).send({ 
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Atualizar fechamento
  app.put("/closings/:id", async (req, rep) => {
    try {
      const { id } = z.object({ id: z.coerce.number() }).parse(req.params);
      const data = updateClosingSchema.parse(req.body);

      // Atualizar fechamento usando Prisma ORM
      const updatedClosing = await prisma.closing.update({
        where: { id },
        data: {
          name: data.name,
          startDate: data.startDate,
          endDate: data.endDate,
          status: data.status,
        },
        include: {
          month: {
            select: {
              id: true,
              name: true,
              year: true,
              month: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
              cnpj: true,
            },
          },
        },
      });

      return rep.send(updatedClosing);
    } catch (error) {
      console.error("Erro ao atualizar fechamento:", error);
      return rep.code(500).send({ 
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Deletar fechamento
  app.delete("/closings/:id", async (req, rep) => {
    try {
      const { id } = z.object({ id: z.coerce.number() }).parse(req.params);

      // Verificar se o fechamento existe
      const closing = await prisma.$queryRaw`
        SELECT * FROM Closing WHERE id = ${id}
      ` as any[];

      if (closing.length === 0) {
        return rep.code(404).send({ message: "Fechamento não encontrado" });
      }

      if (closing[0].status === 'fechado') {
        return rep.code(400).send({ 
          message: "Não é possível deletar um fechamento que já foi fechado" 
        });
      }

      await prisma.$queryRaw`
        DELETE FROM Closing WHERE id = ${id}
      `;

      return rep.send({ message: "Fechamento deletado com sucesso" });
    } catch (error) {
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Fechar fechamento (calcular totais)
  app.post("/closings/:id/close", async (req, rep) => {
    try {
      const { id } = z.object({ id: z.coerce.number() }).parse(req.params);

      const closing = await prisma.closing.findUnique({
        where: { id },
        include: {
          entries: true,
        },
      });

      if (!closing) {
        return rep.code(404).send({ message: "Fechamento não encontrado" });
      }

      if (closing.status === 'fechado') {
        return rep.code(400).send({ message: "Fechamento já está fechado" });
      }

      // Calcular totais reais
      const totalEntries = closing.entries
        .filter(e => e.type === 'entrada')
        .reduce((sum, e) => sum + e.amount, 0);
      
      const totalExpenses = closing.entries
        .filter(e => e.type === 'saida')
        .reduce((sum, e) => sum + e.amount, 0);
      
      const totalTaxes = closing.entries
        .filter(e => e.type === 'imposto')
        .reduce((sum, e) => sum + e.amount, 0);
      
      const balance = totalEntries - totalExpenses - totalTaxes;
      const profitMargin = totalEntries > 0 ? (balance / totalEntries) * 100 : 0;

      // Atualizar fechamento
      const updatedClosing = await prisma.closing.update({
        where: { id },
        data: {
          status: 'fechado',
          totalEntries,
          totalExpenses,
          totalTaxes,
          balance,
          profitMargin,
        },
        include: {
          month: {
            select: {
              id: true,
              name: true,
              year: true,
              month: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
              cnpj: true,
            },
          },
        },
      });

      return rep.send(updatedClosing);
    } catch (error) {
      console.error("Erro ao fechar fechamento:", error);
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Reabrir fechamento
  app.post("/closings/:id/reopen", async (req, rep) => {
    try {
      const { id } = z.object({ id: z.coerce.number() }).parse(req.params);

      const closing = await prisma.$queryRaw`
        SELECT * FROM Closing WHERE id = ${id}
      ` as any[];

      if (closing.length === 0) {
        return rep.code(404).send({ message: "Fechamento não encontrado" });
      }

      if (closing[0].status !== 'fechado') {
        return rep.code(400).send({ message: "Apenas fechamentos fechados podem ser reabertos" });
      }

      await prisma.$queryRaw`
        UPDATE Closing 
        SET status = 'aberto', updatedAt = datetime('now')
        WHERE id = ${id}
      `;

      const updatedClosing = await prisma.$queryRaw`
        SELECT 
          c.*,
          m.name as monthName,
          m.year as monthYear,
          m.month as monthNumber,
          comp.name as companyName,
          comp.cnpj as companyCnpj
        FROM Closing c
        LEFT JOIN Month m ON c.monthId = m.id
        LEFT JOIN Company comp ON c.companyId = comp.id
        WHERE c.id = ${id}
      ` as any[];

      return rep.send(updatedClosing[0] || {});
    } catch (error) {
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Obter entradas financeiras de um fechamento
  app.get("/closings/:id/entries", async (req, rep) => {
    try {
      const { id } = z.object({ id: z.coerce.number() }).parse(req.params);

      const closing = await prisma.closing.findUnique({
        where: { id },
        include: {
          entries: {
            include: {
              company: {
                select: {
                  id: true,
                  name: true,
                  cnpj: true,
                },
              },
            },
            orderBy: { date: 'desc' },
          },
        },
      });

      if (!closing) {
        return rep.code(404).send({ message: "Fechamento não encontrado" });
      }

      return rep.send({
        closing: {
          id: closing.id,
          name: closing.name,
          status: closing.status,
          startDate: closing.startDate,
          endDate: closing.endDate,
        },
        entries: closing.entries,
      });
    } catch (error) {
      console.error("Erro ao buscar entradas do fechamento:", error);
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Obter estatísticas do fechamento
  app.get("/closings/:id/stats", async (req, rep) => {
    try {
      const { id } = z.object({ id: z.coerce.number() }).parse(req.params);

      const closing = await prisma.closing.findUnique({
        where: { id },
        include: {
          entries: true,
          month: true,
          company: true,
        },
      });

      if (!closing) {
        return rep.code(404).send({ message: "Fechamento não encontrado" });
      }

      // Calcular estatísticas
      const totalEntries = closing.entries.filter(e => e.type === 'entrada').length;
      const totalExpenses = closing.entries.filter(e => e.type === 'saida').length;
      const totalTaxes = closing.entries.filter(e => e.type === 'imposto').length;

      const entriesByCategory = closing.entries.reduce((acc, entry) => {
        acc[entry.category] = (acc[entry.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return rep.send({
        closing: {
          id: closing.id,
          name: closing.name,
          status: closing.status,
          startDate: closing.startDate,
          endDate: closing.endDate,
        },
        stats: {
          totalEntries: closing.totalEntries,
          totalExpenses: closing.totalExpenses,
          totalTaxes: closing.totalTaxes,
          balance: closing.balance,
          profitMargin: closing.profitMargin,
          entriesCount: {
            entries: totalEntries,
            expenses: totalExpenses,
            taxes: totalTaxes,
          },
          entriesByCategory,
        },
      });
    } catch (error) {
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });
}
