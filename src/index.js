import app from './app.js';
import dotenv from 'dotenv';
import { sequelize } from './config/db.js';

dotenv.config();

async function main() {
    try {
        await sequelize.sync();
        const port = process.env.PORT || 4000;
        app.listen(port, () => {
            console.log(`App escuchando en el puerto: ${port}`);
        });
    } catch (error) {
        console.error('No se conectó a la base de datos:', error);
    }
}
main();