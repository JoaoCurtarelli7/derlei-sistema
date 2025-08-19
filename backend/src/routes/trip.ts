import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middlewares/authMiddleware";

export async function tripRoutes(app: FastifyInstance) {
  const paramsSchema = z.object({ id: z.coerce.number(), truckId: z.coerce.number() });
  const bodySchema = z.object({
    destination: z.string(),
    driver: z.string(),
    date: z.coerce.date(),
    freightValue: z.coerce.number(),
    truckId: z.coerce.number(),
  });

  app.addHook("preHandler", authenticate);

  app.get("/trips/:truckId", async (req, rep) => {
    const { truckId } = paramsSchema.parse(req.params);
    try {
      const trips = await prisma.trip.findMany({
        where: { truckId },
        include: { expenses: true },
      });
      return trips;
    } catch (error) {
      console.error(error);
      return rep.code(500).send({ message: "Erro ao listar viagens" });
    }
  });

  app.post("/trips", async (req, rep) => {
    const data = bodySchema.parse(req.body);
    try {
      const trip = await prisma.trip.create({ data });
      return rep.code(201).send(trip);
    } catch (error) {
      console.error(error);
      return rep.code(500).send({ message: "Erro ao criar viagem" });
    }
  });

  app.put("/trips/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);
    const data = bodySchema.parse(req.body);

    try {
      const trip = await prisma.trip.update({ where: { id }, data });
      return rep.send(trip);
    } catch (error) {
      console.error(error);
      return rep.code(500).send({ message: "Erro ao atualizar viagem" });
    }
  });

  app.delete("/trips/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);
    try {
      await prisma.trip.delete({ where: { id } });
      return rep.code(204).send();
    } catch (error) {
      console.error(error);
      return rep.code(500).send({ message: "Erro ao deletar viagem" });
    }
  });
}
