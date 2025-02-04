import authRoutes from './routes/authRoutes.js';
import fastifyJwt from 'fastify-jwt';

const fastify = require('fastify');

const app = fastify({ logger: true });

// Configuração do JWT
app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'sua_chave_secreta',
});

// Registra as rotas
app.register(authRoutes);

// Inicia o servidor
const start = async () => {
  try {
    await app.listen({ port: 3000 });
    app.log.info(`Servidor rodando em http://localhost:3000`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();