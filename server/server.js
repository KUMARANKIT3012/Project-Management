import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import {clerkMiddleware} from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import workspaceRouter from './routes/workspaceRoutes.js';
import { protect } from './middlewares/authMiddleware.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware()); // to use the clerk middleware for authentication


app.get('/', (req, res) => res.send('Server is live!'));

// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use("/api/inngest", serve({ client: inngest, functions }));


// Routes
app.use("/api/workspaces", protect, workspaceRouter)


const PORT = process.env.PORT || 5000 // to run the app we need a port number 

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`)); // to run the PORT number we can use this app 
