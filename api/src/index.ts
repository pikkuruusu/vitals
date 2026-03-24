import 'dotenv/config';
import express from 'express';
import { authMiddleware } from './middleware/auth';
import entriesRouter from './routes/entries';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const apiRouter = express.Router();
apiRouter.use(authMiddleware);
apiRouter.use('/entries', entriesRouter);

app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { apiRouter };
