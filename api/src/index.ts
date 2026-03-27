import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authMiddleware } from './middleware/auth';
import entriesRouter from './routes/entries';
import metricsRouter from './routes/metrics';

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL
}));
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const apiRouter = express.Router();
apiRouter.use(authMiddleware);
apiRouter.use('/entries', entriesRouter);
apiRouter.use('/metrics', metricsRouter);

app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { apiRouter };
