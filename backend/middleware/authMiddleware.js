import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET || 'flowershop-secret-key');
    req.user = verified;
    next();
  } catch  {
    res.status(401).json({ message: 'Token verification failed, authorization denied' });
  }
};

export default auth;