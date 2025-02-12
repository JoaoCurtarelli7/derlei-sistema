import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middlewares/authMiddleware";

export async function loadRoutes(app: FastifyInstance) {
  const paramsSchema = z.object({
    id: z.coerce.number(),
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
  

  app.addHook("preHandler", authenticate);

  // Listar todas as cargas/pedidos de uma empresa
  app.get("/loads/:companyId", async (req, rep) => {
    const { companyId } = paramsSchema.parse(req.params);

    try {
      const loads = await prisma.load.findMany({
        where: { companyId },
        select: {
          id: true,
          date: true,
          loadingNumber: true,
          deliveries: true,
          cargoWeight: true,
          totalValue: true,
          freight4: true,
          totalFreight: true,
          closings: true,
          observations: true,
          companyId: true,
        },
      });

      return loads;
    } catch (error) {
      console.error(error);
      return rep.code(500).send({ message: "Erro interno ao buscar os carregamentos" });
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
      // Verificar se o carregamento existe
      const load = await prisma.load.findUniqueOrThrow({ where: { id } });

      // Verificar se a empresa existe
      const companyExists = await prisma.company.findUnique({
        where: { id: companyId },
      });

      if (!companyExists) {
        return rep.code(404).send({ message: "Empresa não encontrada" });
      }

      const updatedLoad = await prisma.load.update({
        where: { id },
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
      await prisma.load.delete({
        where: { id },
      });

      return rep.code(204).send();
    } catch (error) {
      console.error(error);
      return rep.code(500).send({ message: "Erro interno ao deletar o carregamento" });
    }
  });
}
