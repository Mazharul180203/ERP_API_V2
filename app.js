import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from "./routes/api.js";
import bodyParser from "body-parser";
import path from 'path';
dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(cors({origin: 'http://localhost:5173', credentials: true}));
app.use(helmet());
// app.use(hpp());

app.use(cookieParser());

app.use(bodyParser.json())

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb' }));
app.get("/", (req, res) => {
    return res.send("welcome, saurav");
});
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 3000 });
app.use(limiter);
app.use('/api/v1', router);
app.use(express.static('client/dist'));
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
// });

app.listen(PORT, () => {
    console.log(`App Run @${PORT}`);
});

export default app;