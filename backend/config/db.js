import mongoose from 'mongoose';

const connectDatabase = async () => {
    try {
        const uri = process.env.MONGO_URI;

        if (!uri) {
            throw new Error('MONGO_URI غير موجود في ملف .env');
        }

        const conn = await mongoose.connect(uri);

        console.log(`Luxury Database Synchronized: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Failure: ${error.message}`);
        process.exit(1);
    }
};

export default connectDatabase;
