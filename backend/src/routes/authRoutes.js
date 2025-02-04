import { loginUser } from '../controllers/authController.js';

const authRoutes = async (fastify, options) => {
  fastify.post('/register', registerUser);
  fastify.post('/login', loginUser);
};

module.exports = authRoutes;
