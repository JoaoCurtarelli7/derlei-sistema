import { FastifyReply, FastifyRequest } from "fastify";
import { verifyToken } from "../lib/auth";

export async function authMiddleware(req: FastifyRequest, rep: FastifyReply) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return rep.code(401).send({ message: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    req.user = decoded;
  } catch (error) {
    return rep.code(401).send({ message: "Token inválido ou expirado" });
  }
}
