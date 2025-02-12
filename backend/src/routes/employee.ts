import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middlewares/authMiddleware";

export async function employeeRoutes(app: FastifyInstance) {
  const paramsSchema = z.object({
    id: z.coerce.number(),
  });

  const bodySchema = z.object({
    name: z.string(),
    role: z.string(),
    baseSalary: z.coerce.number(),
    status: z.enum(["Ativo", "Inativo"]),
  });

  app.addHook("preHandler", authenticate);
  app.get("/employees", async () => {
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        name: true,
        role: true,
        baseSalary: true,
        status: true,
        transactions: true, 
      },
     
    });

    return employees;
  });

  // Obter um funcionário pelo ID junto com suas transações
  app.get("/employees/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        transactions: true, // Adiciona as transações vinculadas ao funcionário
      },
    });

    if (!employee) {
      return rep.code(404).send({ message: "Funcionário não encontrado" });
    }

    return employee;
  });

  // Criar um funcionário
  app.post("/employees", async (req, rep) => {
    const { name, role, baseSalary, status } = bodySchema.parse(req.body);

    const employee = await prisma.employee.create({
      data: {
        name,
        role,
        baseSalary,
        status,
      },
    });

    return rep.code(201).send(employee);
  });

  // Atualizar um funcionário
  app.put("/employees/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);
    const { name, role, baseSalary, status } = bodySchema.parse(req.body);

    try {
      await prisma.employee.findUniqueOrThrow({ where: { id } });

      const updatedEmployee = await prisma.employee.update({
        where: { id },
        data: { name, role, baseSalary, status },
      });

      return rep.send(updatedEmployee);
    } catch (error) {
      console.error(error);
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Deletar um funcionário
  app.delete("/employees/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);

    await prisma.employee.delete({ where: { id } });

    return rep.code(204).send();
  });

  // Listar créditos e débitos do funcionário
  app.get("/employees/:id/transactions", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);

    const transactions = await prisma.transaction.findMany({
      where: { employeeId: id },
      select: {
        id: true,
        type: true,
        amount: true,
        date: true,
      },
    });

    return transactions;
  });

  app.post("/employees/:id/transactions", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);

    const transactionSchema = z.object({
      type: z.enum(["Crédito", "Débito"]),
      amount: z.coerce.number(),
    });

    const { type, amount } = transactionSchema.parse(req.body);

    // Verifica se o funcionário existe
    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) {
      return rep.code(404).send({ message: "Funcionário não encontrado" });
    }

    const transaction = await prisma.transaction.create({
      data: {
        employeeId: id,
        type,
        amount,
      },
    });

    return rep.code(201).send(transaction);
  });
}
