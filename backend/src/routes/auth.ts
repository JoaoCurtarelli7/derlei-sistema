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
      console.log("Tentativa de login recebida!");

      const { email, password } = loginSchema.parse(req.body);
      console.log("Email:", email);

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        console.log("Usuário não encontrado");
        return rep.status(401).send({ message: "Email ou senha inválidos" });
      }

      console.log("Usuário encontrado:", user);

      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log("Senha válida?", isPasswordValid);

      if (!isPasswordValid) {
        return rep.status(401).send({ message: "Email ou senha inválidos" });
      }

      const token = jwt.sign({ userId: user.id }, "secreta-chave", { expiresIn: "1h" });
      console.log("Token gerado:", token);

      return rep.send({ token });
    } catch (error) {
      console.error("Erro no login:", error);
      return rep.status(500).send({ message: "Erro no servidor" });
    }
  });

  app.get("/me", async (req, rep) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return rep.code(401).send({ message: "Token não fornecido" });
      }

      const token = authHeader.split(" ")[1];

      // 🔥 Alterado para usar jwt.verify diretamente
      const decoded: any = jwt.verify(token, "secreta-chave");

      console.log("Decoded token:", decoded);

      // 🔥 Correção: Usando "userId" em vez de "id"
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, name: true, email: true, createdAt: true },
      });

      if (!user) {
        return rep.code(401).send({ message: "Usuário não encontrado" });
      }

      return rep.send(user);
    } catch (error) {
      console.error("Erro ao validar token:", error);
      return rep.code(401).send({ message: "Token inválido ou expirado" });
    }
  });
}
