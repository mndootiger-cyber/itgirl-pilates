import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import connectDatabase from './config/db.js';

dotenv.config();
connectDatabase();

const importData = async () => {
    try {
        await Admin.deleteMany();
        const admin = new Admin({
            email: 'admin@itgirl.com',
            password: 'password123' // سيتم تشفيرها تلقائياً
        });
        await admin.save();
        console.log('Admin Imported! Login with: admin@itgirl.com / password123');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};
importData();
