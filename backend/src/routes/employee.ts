import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middlewares/authMiddleware";

export async function employeeRoutes(app: FastifyInstance) {
  const paramsSchema = z.object({
    id: z.coerce.number(),
  });

  const bodySchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    role: z.string().min(2, "Cargo deve ter pelo menos 2 caracteres"),
    baseSalary: z.coerce.number().min(0, "Salário deve ser maior que zero"),
    status: z.enum(["Ativo", "Inativo"]),
    cpf: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    address: z.string().optional(),
    hireDate: z.string().optional(),
  });

  app.addHook("preHandler", authenticate);

  // Listar todos os funcionários
  app.get("/employees", async (req, rep) => {
    try {
      const employees = await prisma.employee.findMany({
        select: {
          id: true,
          name: true,
          role: true,
          baseSalary: true,
          status: true,
          cpf: true,
          phone: true,
          email: true,
          address: true,
          hireDate: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return rep.send(employees);
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Obter um funcionário pelo ID
  app.get("/employees/:id", async (req, rep) => {
    try {
      const { id } = paramsSchema.parse(req.params);

      const employee = await prisma.employee.findUnique({
        where: { id },
        include: {
          transactions: {
            orderBy: {
              date: "desc",
            },
          },
        },
      });

      if (!employee) {
        return rep.code(404).send({ message: "Funcionário não encontrado" });
      }

      return rep.send(employee);
    } catch (error) {
      console.error("Erro ao buscar funcionário:", error);
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Criar um funcionário
  app.post("/employees", async (req, rep) => {
    try {
      const data = bodySchema.parse(req.body);

      // Verificar se CPF já existe (se fornecido)
      if (data.cpf && data.cpf.trim() !== "") {
        const existingEmployee = await prisma.employee.findUnique({
          where: { cpf: data.cpf },
        });
        if (existingEmployee) {
          return rep.code(400).send({ message: "CPF já cadastrado" });
        }
      }

      // Converter data de contratação se fornecida
      const hireDate = data.hireDate ? new Date(data.hireDate) : new Date();

      const employee = await prisma.employee.create({
        data: {
          name: data.name,
          role: data.role,
          baseSalary: data.baseSalary,
          status: data.status,
          cpf: data.cpf && data.cpf.trim() !== "" ? data.cpf : null,
          phone: data.phone && data.phone.trim() !== "" ? data.phone : null,
          email: data.email && data.email.trim() !== "" ? data.email : null,
          address: data.address && data.address.trim() !== "" ? data.address : null,
          hireDate,
        },
      });

      return rep.code(201).send(employee);
    } catch (error) {
      console.error("Erro ao criar funcionário:", error);
      if (error.code === "P2002") {
        return rep.code(400).send({ message: "CPF já cadastrado" });
      }
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Atualizar um funcionário
  app.put("/employees/:id", async (req, rep) => {
    try {
      const { id } = paramsSchema.parse(req.params);
      const data = bodySchema.parse(req.body);

      // Verificar se funcionário existe
      const existingEmployee = await prisma.employee.findUnique({
        where: { id },
      });

      if (!existingEmployee) {
        return rep.code(404).send({ message: "Funcionário não encontrado" });
      }

      // Verificar se CPF já existe em outro funcionário (se fornecido)
      if (data.cpf && data.cpf.trim() !== "" && data.cpf !== existingEmployee.cpf) {
        const duplicateCpf = await prisma.employee.findUnique({
          where: { cpf: data.cpf },
        });
        if (duplicateCpf) {
          return rep.code(400).send({ message: "CPF já cadastrado" });
        }
      }

      // Converter data de contratação se fornecida
      const hireDate = data.hireDate ? new Date(data.hireDate) : existingEmployee.hireDate;

      const updatedEmployee = await prisma.employee.update({
        where: { id },
        data: {
          name: data.name,
          role: data.role,
          baseSalary: data.baseSalary,
          status: data.status,
          cpf: data.cpf && data.cpf.trim() !== "" ? data.cpf : null,
          phone: data.phone && data.phone.trim() !== "" ? data.phone : null,
          email: data.email && data.email.trim() !== "" ? data.email : null,
          address: data.address && data.address.trim() !== "" ? data.address : null,
          hireDate,
        },
      });

      return rep.send(updatedEmployee);
    } catch (error) {
      console.error("Erro ao atualizar funcionário:", error);
      if (error.code === "P2002") {
        return rep.code(400).send({ message: "CPF já cadastrado" });
      }
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Deletar um funcionário
  app.delete("/employees/:id", async (req, rep) => {
    try {
      const { id } = paramsSchema.parse(req.params);

      // Verificar se funcionário existe
      const existingEmployee = await prisma.employee.findUnique({
        where: { id },
      });

      if (!existingEmployee) {
        return rep.code(404).send({ message: "Funcionário não encontrado" });
      }

      await prisma.employee.delete({ where: { id } });

      return rep.code(204).send();
    } catch (error) {
      console.error("Erro ao deletar funcionário:", error);
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Listar transações do funcionário
  app.get("/employees/:id/transactions", async (req, rep) => {
    try {
      const { id } = paramsSchema.parse(req.params);

      const transactions = await prisma.transaction.findMany({
        where: { employeeId: id },
        select: {
          id: true,
          type: true,
          amount: true,
          date: true,
        },
        orderBy: {
          date: "desc",
        },
      });

      return rep.send(transactions);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Adicionar transação para funcionário
  app.post("/employees/:id/transactions", async (req, rep) => {
    try {
      const { id } = paramsSchema.parse(req.params);

      const transactionSchema = z.object({
        type: z.enum(["Crédito", "Débito"]),
        amount: z.coerce.number().min(0.01, "Valor deve ser maior que zero"),
        date: z.string().optional(),
      });

      const { type, amount, date } = transactionSchema.parse(req.body);

      // Verifica se o funcionário existe
      const employee = await prisma.employee.findUnique({ where: { id } });
      if (!employee) {
        return rep.code(404).send({ message: "Funcionário não encontrado" });
      }

      const transactionDate = date ? new Date(date) : new Date();

      const transaction = await prisma.transaction.create({
        data: {
          employeeId: id,
          type,
          amount,
          date: transactionDate,
        },
      });

      return rep.code(201).send(transaction);
    } catch (error) {
      console.error("Erro ao criar transação:", error);
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Buscar funcionários por filtros
  app.get("/employees/search", async (req, rep) => {
    try {
      const querySchema = z.object({
        name: z.string().optional(),
        role: z.string().optional(),
        status: z.string().optional(),
      });

      const { name, role, status } = querySchema.parse(req.query);

      const where: any = {};
      if (name) {
        where.name = { contains: name };
      }
      if (role) {
        where.role = { contains: role };
      }
      if (status) {
        where.status = status;
      }

      const employees = await prisma.employee.findMany({
        where,
        select: {
          id: true,
          name: true,
          role: true,
          baseSalary: true,
          status: true,
          cpf: true,
          phone: true,
          email: true,
          address: true,
          hireDate: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      return rep.send(employees);
    } catch (error) {
      console.error("Erro na busca de funcionários:", error);
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });
}
