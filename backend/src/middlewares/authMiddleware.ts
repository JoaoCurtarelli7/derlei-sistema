import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends FastifyRequest {
  user?: { id: number };
}

async function authenticate(req: AuthenticatedRequest, rep: FastifyReply) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return rep.code(401).send({ message: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, "secreta-chave");

    req.user = { id: decoded.userId }; 
  } catch (error) {
    return rep.code(401).send({ message: "Token inválido ou expirado" });
  }
}

export { authenticate };
