import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = (req, res, next) => {
    // Obtiene el token del encabezado
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
    }

    try {
        // Divide el token del formato 'Bearer [token]'
        const token = authHeader.split(' ')[1];
        // Verifica y decodifica el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Adjunta la información del usuario decodificada al objeto de la solicitud (req)
        req.user = decoded;
        // Continua hacia la siguiente función en la pila de middleware o la ruta
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Token no válido.' });
    }
};

export default authMiddleware;
