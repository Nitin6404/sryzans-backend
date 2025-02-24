import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const caCert = fs.readFileSync(path.join(__dirname, '../../ca.crt'));

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: true,
            ca: caCert,
        },
    },
    pool: {
        max: 3,
        min: 0,
        acquire: 60000,
        idle: 10000,
    },
    logging: process.env.NODE_ENV === 'development',
});

// Export the initialization function separately
export const initDatabase = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        // Using process.stdout.write for logging in development
        if (process.env.NODE_ENV === 'development') {
            process.stdout.write('Database connection established successfully\n');
        }
    } catch (error) {
        // Using process.stderr.write for error logging
        process.stderr.write(`Unable to connect to the database: ${error}\n`);
        process.exit(1);
    }
};

// Don't initialize connection here
export default sequelize;
