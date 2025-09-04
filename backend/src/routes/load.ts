import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middlewares/authMiddleware";

export async function loadRoutes(app: FastifyInstance) {
  const paramsSchema = z.object({
    id: z.coerce.number(),
  });

  const companyParamsSchema = z.object({
    companyId: z.coerce.number(),
  });

  const bodySchema = z.object({
    date: z.coerce.date(),
    loadingNumber: z.string(),
    deliveries: z.coerce.number(),
    cargoWeight: z.coerce.number(),
    totalValue: z.coerce.number(),
    freight4: z.coerce.number(),
    totalFreight: z.coerce.number(),
    closings: z.coerce.number(),
    observations: z.string().optional(),
    companyId: z.number(),  
  });
  
  const updateBodySchema = z.object({
    date: z.coerce.date().optional(),
    loadingNumber: z.string().optional(),
    deliveries: z.coerce.number().optional(),
    cargoWeight: z.coerce.number().optional(),
    totalValue: z.coerce.number().optional(),
    freight4: z.coerce.number().optional(),
    totalFreight: z.coerce.number().optional(),
    closings: z.coerce.number().optional(),
    observations: z.string().optional(),
    companyId: z.number().optional(),
  });

  app.addHook("preHandler", authenticate);

  // Listar todas as cargas/pedidos
  app.get("/loads", async (req, rep) => {
    try {
      const loads = await prisma.load.findMany({
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
          date: 'desc',
        },
      });

      return loads;
    } catch (error) {
      console.error(error);
      return rep.code(500).send({ message: "Erro interno ao buscar os carregamentos" });
    }
  });

  // Listar todas as cargas/pedidos de uma empresa específica
  app.get("/loads/company/:companyId", async (req, rep) => {
    const { companyId } = companyParamsSchema.parse(req.params);

    try {
      // Verificar se a empresa existe
      const companyExists = await prisma.company.findUnique({
        where: { id: companyId },
      });

      if (!companyExists) {
        return rep.code(404).send({ message: "Empresa não encontrada" });
      }

      const loads = await prisma.load.findMany({
        where: { companyId },
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
          date: 'desc',
        },
      });

      return loads;
    } catch (error) {
      console.error(error);
      return rep.code(500).send({ message: "Erro interno ao buscar os carregamentos da empresa" });
    }
  });

  // Buscar uma carga específica por ID
  app.get("/loads/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);

    try {
      const load = await prisma.load.findUnique({
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

      if (!load) {
        return rep.code(404).send({ message: "Carregamento não encontrado" });
      }

      return load;
    } catch (error) {
      console.error(error);
      return rep.code(500).send({ message: "Erro interno ao buscar o carregamento" });
    }
  });

  // Criar um novo carregamento/pedido
  app.post("/loads", async (req, rep) => {
    const {
      date,
      loadingNumber,
      deliveries,
      cargoWeight,
      totalValue,
      freight4,
      totalFreight,
      closings,
      observations,
      companyId,
    } = bodySchema.parse(req.body);
  
    try {
      // Verificar se a empresa existe
      const companyExists = await prisma.company.findUnique({
        where: { id: companyId },
      });
  
      if (!companyExists) {
        return rep.code(404).send({ message: "Empresa não encontrada" });
      }

      // Verificar se já existe um carregamento com o mesmo número
      const existingLoad = await prisma.load.findFirst({
        where: {
          loadingNumber,
          companyId,
        },
      });

      if (existingLoad) {
        return rep.code(400).send({ message: "Já existe um carregamento com este número para esta empresa" });
      }
  
      const load = await prisma.load.create({
        data: {
          date,
          loadingNumber,
          deliveries,
          cargoWeight,
          totalValue,
          freight4,
          totalFreight,
          closings,
          observations,
          company: {
            connect: {
              id: companyId,
            },
          },
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
  
      return rep.code(201).send(load);
    } catch (error) {
      console.error("Erro ao criar carregamento:", error);
      return rep.code(500).send({ message: "Erro interno ao criar o carregamento", error });
    }
  });
  
  // Atualizar um carregamento/pedido
  app.put("/loads/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);
    const updateData = updateBodySchema.parse(req.body);

    try {
      // Verificar se o carregamento existe
      const existingLoad = await prisma.load.findUnique({
        where: { id },
      });

      if (!existingLoad) {
        return rep.code(404).send({ message: "Carregamento não encontrado" });
      }

      // Se estiver atualizando a empresa, verificar se ela existe
      if (updateData.companyId) {
        const companyExists = await prisma.company.findUnique({
          where: { id: updateData.companyId },
        });

        if (!companyExists) {
          return rep.code(404).send({ message: "Empresa não encontrada" });
        }
      }

      // Se estiver atualizando o número do carregamento, verificar se não existe duplicata
      if (updateData.loadingNumber && updateData.companyId) {
        const duplicateLoad = await prisma.load.findFirst({
          where: {
            loadingNumber: updateData.loadingNumber,
            companyId: updateData.companyId,
            id: { not: id },
          },
        });

        if (duplicateLoad) {
          return rep.code(400).send({ message: "Já existe um carregamento com este número para esta empresa" });
        }
      }

      const updatedLoad = await prisma.load.update({
        where: { id },
        data: updateData,
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

      return rep.send(updatedLoad);
    } catch (error) {
      console.error(error);
      return rep.code(500).send({ message: "Erro interno ao atualizar o carregamento" });
    }
  });

  // Deletar um carregamento/pedido
  app.delete("/loads/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);

    try {
      // Verificar se o carregamento existe
      const existingLoad = await prisma.load.findUnique({
        where: { id },
      });

      if (!existingLoad) {
        return rep.code(404).send({ message: "Carregamento não encontrado" });
      }

      await prisma.load.delete({
        where: { id },
      });

      return rep.code(204).send();
    } catch (error) {
      console.error(error);
      return rep.code(500).send({ message: "Erro interno ao deletar o carregamento" });
    }
  });

  // Buscar cargas por período
  app.get("/loads/period", async (req, rep) => {
    const querySchema = z.object({
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
      companyId: z.coerce.number().optional(),
    });

    try {
      const { startDate, endDate, companyId } = querySchema.parse(req.query);

      const whereClause: any = {
        date: {
          gte: startDate,
          lte: endDate,
        },
      };

      if (companyId) {
        whereClause.companyId = companyId;
      }

      const loads = await prisma.load.findMany({
        where: whereClause,
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
          date: 'desc',
        },
      });

      return loads;
    } catch (error) {
      console.error(error);
      return rep.code(500).send({ message: "Erro interno ao buscar carregamentos por período" });
    }
  });
}
