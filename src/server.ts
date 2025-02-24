import app from './app';
import sequelize from './config/database'; // Changed from database.config
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
        await sequelize.authenticate();
        await sequelize.sync();
        logger.info('Database connection established successfully.');

        const httpServer = server.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
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
        logger.error(`Unable to start server: ${error}`);
        process.exit(1);
    }
}

startServer().catch((error) => {
    logger.error(`Server startup failed: ${error}`);
    process.exit(1);
});
