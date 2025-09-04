import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middlewares/authMiddleware";

export async function companyRoutes(app: FastifyInstance) {
  const paramsSchema = z.object({
    id: z.coerce.number(),
  });

  const bodySchema = z.object({
    name: z.string(),
    type: z.string(),
    cnpj: z.string(),
    dateRegistration: z.coerce.date(),
    status: z.enum(["Ativo", "Inativo"]),
    responsible: z.string(),
    commission: z.coerce.number(),
  });

  // Listar todas as empresas (rota pública para permitir seleção)
  app.get("/companies", async () => {
    try {
      const companies = await prisma.company.findMany({
        select: {
          id: true,
          name: true,
          type: true,
          cnpj: true,
          dateRegistration: true,
          status: true,
          responsible: true,
          commission: true,
        },
      });

      return companies;
    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
      throw error;
    }
  });

  // 🔒 Protege as rotas restantes da empresa
  app.addHook("preHandler", authenticate);

  // Obter uma empresa pelo ID
  app.get("/company/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);

    const company = await prisma.company.findUniqueOrThrow({
      where: { id },
    });

    return company;
  });

  // Criar uma nova empresa
  app.post("/company", async (req, rep) => {
    const { name, type, cnpj, dateRegistration, status, responsible, commission } =
      bodySchema.parse(req.body);

    try {
      const company = await prisma.company.create({
        data: { name, type, cnpj, dateRegistration, status, responsible, commission },
      });

      return rep.code(201).send(company);
    } catch (error: any) {
      if (error.code === "P2002" && error.meta?.target?.includes("cnpj")) {
        return rep.code(400).send({ message: "Já existe uma empresa cadastrada com este CNPJ" });
      }
      console.error("Erro ao criar empresa:", error);
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Atualizar uma empresa existente
  app.put("/company/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);
    const { name, type, cnpj, dateRegistration, status, responsible, commission } =
      bodySchema.parse(req.body);

    try {
      await prisma.company.findUniqueOrThrow({ where: { id } });

      const updatedCompany = await prisma.company.update({
        where: { id },
        data: { name, type, cnpj, dateRegistration, status, responsible, commission },
      });

      return rep.send(updatedCompany);
    } catch (error: any) {
      if (error.code === "P2002" && error.meta?.target?.includes("cnpj")) {
        return rep.code(400).send({ message: "Já existe uma empresa cadastrada com este CNPJ" });
      }
      console.error("Erro ao atualizar empresa:", error);
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Deletar uma empresa
  app.delete("/company/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);

    try {
      const company = await prisma.company.delete({ where: { id } });
      return company;
    } catch (error) {
      console.error("Erro ao deletar empresa:", error);
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });
}
