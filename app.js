import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import fileUpload from 'express-fileupload';
import hpp from 'hpp';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from "./routes/api.js";
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = process.env.PORT || 5040;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

app.use(helmet());
// app.use(hpp());

app.use(cookieParser());

app.use(bodyParser.json())

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb' }));
app.get("/", (req, res) => {
    return res.send("welcome, saurav");
});

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 3000 });
app.use(limiter);
app.use('/api/v1', router);
app.use(express.static(path.join(__dirname, "uploadFile")));
app.use(express.static('frontend/build'));
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
// });

server.listen(PORT, () => {
    console.log(`App Run @${PORT}`);
});

export default app;