import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import api from "./routes/server.js";

const app = express();

// Define the allowed origin (IP address and port)
const allowedOrigin = 'http://10.42.0.243:3000'; // e.g., 'http://192.168.1.100:8080'

// Configure CORS options
const corsOptions = {
  origin: allowedOrigin,
  optionsSuccessStatus: 200 // For legacy browser support
};

// Apply the CORS middleware with the specified options
app.use(cors(corsOptions));
app.use(express.json());

// Basic health‑check
app.get('/', (_req: Request, res: Response) => {
  res.send('Oracle Dataset API is running');
});

app.use('/api', api)

// 404
app.use((_req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;