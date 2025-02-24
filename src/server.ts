import app from './app';
import sequelize, { initDatabase } from './config/database';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = app;

const logger = {
    info: (message: string): void => {
        // eslint-disable-next-line no-console
        console.log(message);
    },
    error: (message: string): void => {
        // eslint-disable-next-line no-console
        console.error(message);
    },
};

async function startServer(): Promise<void> {
    try {
        // Initialize database once
        await initDatabase();

        const httpServer = server.listen(PORT, () => {
            logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
        });

        process.on('SIGTERM', () => {
            logger.info('SIGTERM signal received.');
            httpServer.close(async () => {
                await sequelize.close();
                logger.info('Server closed.');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            logger.info('SIGINT signal received.');
            httpServer.close(async () => {
                await sequelize.close();
                logger.info('Server closed.');
                process.exit(0);
            });
        });
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Server startup failed: ${error.message}`);
            if (error.stack) {
                logger.error(`Stack trace: ${error.stack}`);
            }
        }
        process.exit(1);
    }
}

startServer().catch((error) => {
    logger.error(`Server startup failed: ${error}`);
    process.exit(1);
});
