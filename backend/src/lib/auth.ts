import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const SALT_ROUNDS = 10;

// Gera um hash seguro da senha
export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Verifica se a senha está correta
export async function comparePasswords(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

// Gera um token JWT válido por 1 hora
export function generateToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

// Verifica e decodifica o token JWT
export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
