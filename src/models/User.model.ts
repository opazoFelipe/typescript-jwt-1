import { Schema, model, Document } from 'mongoose';
import bcrypt, { genSaltSync } from 'bcrypt-nodejs';

export interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    encryptPassword(password: string): string,
    comparePassword(password: string): string
}

const userSchema: Schema = new Schema({
    username: {
        type: String,
        required: true,
        min: 4,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
}); 

userSchema.methods.encryptPassword = (password: string): string => {
   
    const salt: number = parseInt(process.env.SALT || '10');
    return bcrypt.hashSync(password, genSaltSync(salt));
}

userSchema.methods.comparePassword = function (password: string): boolean {
    return bcrypt.compareSync(password, this.password);
}

export default model<IUser>('User', userSchema);