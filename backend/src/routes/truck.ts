import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middlewares/authMiddleware";

export async function truckRoutes(app: FastifyInstance) {
  const paramsSchema = z.object({
    id: z.coerce.number(),
  });

  const bodySchema = z.object({
    name: z.string(),
    plate: z.string(),
    brand: z.string(),
    year: z.coerce.number(),
    docExpiry: z.coerce.date(),
    renavam: z.string(),
    image: z.string().optional(),
  });

  app.addHook("preHandler", authenticate);

  // Listar todos os caminhões
  app.get("/trucks", async (req, rep) => {
    try {
      const trucks = await prisma.truck.findMany({
        include: { maintenances: true, trips: true },
      });
      return trucks;
    } catch (error) {
      console.error(error);
      return rep.code(500).send({ message: "Erro ao listar caminhões" });
    }
  });

  // Buscar caminhão por id
  app.get("/trucks/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);
    try {
      const truck = await prisma.truck.findUniqueOrThrow({
        where: { id },
        include: { maintenances: true, trips: true },
      });
      return truck;
    } catch (error) {
      console.error(error);
      return rep.code(404).send({ message: "Caminhão não encontrado" });
    }
  });

  // Criar caminhão
  app.post("/trucks", async (req, rep) => {
    const data = bodySchema.parse(req.body);
    try {
      const truck = await prisma.truck.create({ data });
      return rep.code(201).send(truck);
    } catch (error) {
      console.error(error);
      return rep.code(500).send({ message: "Erro ao criar caminhão" });
    }
  });

  // Atualizar caminhão
  app.put("/trucks/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);
    const data = bodySchema.parse(req.body);

    try {
      const truck = await prisma.truck.update({ where: { id }, data });
      return rep.send(truck);
    } catch (error) {
      console.error(error);
      return rep.code(500).send({ message: "Erro ao atualizar caminhão" });
    }
  });

  // Deletar caminhão
  app.delete("/trucks/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);

    try {
      await prisma.truck.delete({ where: { id } });
      return rep.code(204).send();
    } catch (error) {
      console.error(error);
      return rep.code(500).send({ message: "Erro ao deletar caminhão" });
    }
  });
}
