import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import {clerkMiddleware} from '@clerk/express'

const app = express();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware()); // to use the clerk middleware for authentication


app.get('/', (req, res) => res.send('Server is live!'));

const PORT = process.env.PORT || 5000 // to run the app we need a port number 

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`)); // to run the PORT number we can use this app 
