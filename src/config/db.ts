import mongoose from 'mongoose';
import logger from "../utils/logger";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI!);
        logger.info('MongoDB connected');
    } catch (error) {
        logger.error({ err: (error as any)?.message || error }, 'MongoDB connection failed');
        process.exit(1);
    }
};