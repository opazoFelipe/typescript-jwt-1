import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { SERVER_ADDRESS } from './keys';

const URI: string = process.env.SERVER_ADDRESS || SERVER_ADDRESS;
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(db => console.log('Database is connected'))
    .catch(err => console.error(err));