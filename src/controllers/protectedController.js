export const clientPage = (req, res) => {
    if (req.user.rol_usuario !== 'Cliente') {
        return res.status(403).json({ message: 'No tienes permiso para acceder a esta ruta.' });
    }
    res.send('Página principal del cliente');
};

export const sellerPage = (req, res) => {
    if (req.user.rol_usuario !== 'Vendedor') {
        return res.status(403).json({ message: 'No tienes permiso para acceder a esta ruta.' });
    }
    res.send('Página del vendedor');
};

export const deliveryPage = (req, res) => {
    if (req.user.rol_usuario !== 'Domiciliario') {
        return res.status(403).json({ message: 'No tienes permiso para acceder a esta ruta.' });
    }
    res.send('Página del domiciliario');
};

export const adminPage = (req, res) => {
    if (req.user.rol_usuario !== 'Administrador') {
        return res.status(403).json({ message: 'No tienes permiso para acceder a esta ruta.' });
    }
    res.send('Página del administrador');
};
