import mongoose from 'mongoose';

const roles = ['user', 'admin'];

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    rol: { type: String, enumr: roles, default: "user" },
    provider: String,

}, { timestamps: true });


export default mongoose.model('User', userSchema);
