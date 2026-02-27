
import mongoose from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import pkg from 'dotenv';
const { config } = pkg;
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sk-associates';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function runTest() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const testEmail = 'test-reset-' + Date.now() + '@example.com';
        const initialPassword = 'InitialPassword123!';
        const newPassword = 'NewPassword456!';

        // 1. Create a user
        console.log('1. Creating test user:', testEmail);
        const hashedPassword = await bcrypt.hash(initialPassword, 10);
        const user = await User.create({
            name: 'Test User',
            email: testEmail.toLowerCase(), // Normalize as our signup route does
            password: hashedPassword,
        });

        // 2. Generate reset token (simulating forgot-password logic)
        console.log('2. Generating reset token...');
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        await user.save();

        console.log('Token saved to DB.');

        // 3. Verify token (simulating reset-password logic)
        console.log('3. Verifying token in DB...');
        const foundUser = await User.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: new Date() },
        });

        if (!foundUser) {
            throw new Error('FAILED: Could not find user with valid token and expiry');
        }
        console.log('SUCCESS: Token is valid and non-expired.');

        // 4. Update password
        console.log('4. Updating password...');
        foundUser.password = await bcrypt.hash(newPassword, 10);
        foundUser.resetPasswordToken = undefined;
        foundUser.resetPasswordExpires = undefined;
        await foundUser.save();

        // 5. Verify password change
        console.log('5. Verifying password change...');
        const updatedUser = await User.findById(user._id);
        const isMatch = await bcrypt.compare(newPassword, updatedUser.password);
        
        if (!isMatch) {
            throw new Error('FAILED: Passwords do not match');
        }
        
        console.log('+++ SUCCESS: Password reset flow verified successfully.');

        // Cleanup
        await User.deleteOne({ _id: user._id });
        console.log('Test user cleaned up.');

        process.exit(0);
    } catch (error) {
        console.error('--- ERROR during test:', error);
        process.exit(1);
    }
}

runTest();
