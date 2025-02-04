import { findUserByEmail } from '../services/authService.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwtUtils.js';

export const loginUser = async (request, reply) => {
  const { email, password } = request.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return reply.status(404).send({ error: 'Usuário não encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return reply.status(401).send({ error: 'Senha inválida' });
    }

    const token = generateToken({ userId: user.id, email: user.email });

    reply.status(200).send({ message: 'Login realizado com sucesso!', token });
  } catch (error) {
    reply.status(400).send({ error: 'Erro ao fazer login', details: error.message });
  }
};