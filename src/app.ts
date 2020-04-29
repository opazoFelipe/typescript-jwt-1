import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/auth.route';

const app: Application = express();
app.use(helmet());

// Settings
app.set('port', process.env.SERVER_PORT || 3000);

// Middlewares
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

export default app;