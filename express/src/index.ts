import express, { type Request, type Response } from 'express';
import { getMorganLogger } from './middleware/logger';

const app = express();

// Use body-parser middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(getMorganLogger());

app.use((req: Request, res: Response) => {
  res.status(404).send(`Cannot ${req.method} ${req.url}`);
});

// Listen to the App Engine-specified port, or 8082 otherwise
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

