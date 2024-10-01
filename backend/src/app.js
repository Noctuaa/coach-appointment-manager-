import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import Knex from 'knex';
import { Model } from 'objection';
import knexConfig from '../knexfile.js';
const knex = Knex(knexConfig.development);

// Lier tous les modèles Objection.js à l'instance Knex
Model.knex(knex);

// Import Routes
import authRoutes from './routes/auth.js';



const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Route Auth
app.use('/api/auth', authRoutes);

export default app;