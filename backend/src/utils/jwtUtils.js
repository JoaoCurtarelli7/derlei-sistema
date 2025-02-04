import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'K2#f8aPZ$@xLJ7vWhQ39!TmN*YG6r0Hc';

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};