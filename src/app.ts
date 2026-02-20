import express from 'express';
import routes from './routes/indexRoute'; 

import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './middlewares/errorHandler.middleware';


const app = express();

// MIDDLEWARES
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// RUTAS

// rutas de API
app.use('/api', routes); 


// MIDDLEWARES
app.use(globalErrorHandler);

export default app;