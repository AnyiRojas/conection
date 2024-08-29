// middleware/login.middleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Usuario } from '../models/Usuario.model.js';

dotenv.config();

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // No token provided

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await Usuario.findByPk(decoded.id);
        if (!req.user) return res.sendStatus(404); // User not found
        next();
    } catch (error) {
        res.status(403).json({ message: 'Token no válido.' });
    }
};

export default authMiddleware;
