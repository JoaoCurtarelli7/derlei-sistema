import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { hashPassword } from "../lib/auth";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function authRoutes(app: FastifyInstance) {
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  app.post("/register", async (req, rep) => {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { name, email, password } = bodySchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return rep.code(400).send({ message: "E-mail já está em uso" });
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return rep.code(201).send({ message: "Usuário criado com sucesso!" });
  });

  app.post("/login", async (req, rep) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return rep.status(401).send({ message: "Email ou senha inválidos" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return rep.status(401).send({ message: "Email ou senha inválidos" });
      }

      const token = jwt.sign({ userId: user.id }, "secreta-chave", { expiresIn: "1h" });

      return rep.send({ 
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error("Erro no login:", error);
      return rep.status(500).send({ message: "Erro no servidor" });
    }
  });
}
