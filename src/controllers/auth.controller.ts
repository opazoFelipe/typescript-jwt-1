import { JWT_SECRET } from '../keys';
import { Request, Response } from 'express';
import User, { IUser } from '../models/User.model';

import jwt from 'jsonwebtoken';

export const signup = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const user = {
            username: username || '', 
            email: email || '', 
            password: password || ''
        };

        let temp = await User.findOne({username}, {password: 0});
     
        if(temp) {
            return res.status(400).json({message: "El usuario ya existe"});
        }

        temp = await User.findOne({email}, {password: 0});
     
        if(temp) {
            return res.status(400).json({message: "El email ya existe"});
        }

        const newUser: IUser = new User(user);
        newUser.password = newUser.encryptPassword(newUser.password);
        const savedUser = await newUser.save();

        // Token
        const token: string = jwt.sign({_id: savedUser._id}, process.env.JWT_SECRET || JWT_SECRET);

        res.header('auth-token', token).json(savedUser);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error interno del servidor o error en la peticion'});
    }
}

export const signin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({email});
     
        if(!user) {
            return res.status(400).json({message: "El email no existe"});
        }

        if(!user.comparePassword(password)) {
            return res.status(400).json({message: "Password Incorrecta"});
        }

        // Token
        const token: string = jwt.sign({_id: user._id}, process.env.JWT_SECRET || JWT_SECRET);

        res.header('auth-token', token).json({message: "Welcome"});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error interno del servidor o error en la peticion'});
    }
}

export const profile = async (req: Request, res: Response) => {
    const user = await User.findById(req.userId, {password: 0});
    if(!user) {
        return res.status(404).json('Dont user found');
    }
    res.status(200).json(`Bienvenido ${user.email}`);
}


