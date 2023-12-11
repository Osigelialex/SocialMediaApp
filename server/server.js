import express, { json, urlencoded } from 'express';
import routes from './routes/index.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(json());
app.use(urlencoded({ extended: true }));
app.use('/api', routes);

app.listen(port, () => console.log(`server listening on ${port}`));

export default app;
