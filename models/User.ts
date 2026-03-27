import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        unique: [true, 'Email already exists'],
        required: [true, 'Email is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    image: {
        type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, {
    timestamps: true,
});

const User = models.User || model('User', UserSchema);

export default User;
