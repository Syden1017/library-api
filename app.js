const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const errorMiddleware = require("./middleware/error");
const indexRouter = require("./routes/index");
const booksRouter = require("./routes/books");
const userApiRouter = require("./routes/api/user");
const booksApiRouter = require("./routes/api/books");
const commentsRouter = require("./routes/comments");
const passportConfig = require("./config/passport");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/comments", commentsRouter);
app.use("/books", booksRouter);
app.use("/api/user", userApiRouter);
app.use("/api/books", booksApiRouter);

app.use(errorMiddleware);
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('newComment', (comment) => {
        io.emit('newComment', comment);
    });

    socket.on('disconnect', () => {
        console.log('User  disconnected');
    });
});

const port = process.env.PORT || 3000;
const dbName = process.env.DB_NAME || "db";

async function start() {
    try {
        const UrlDb = `mongodb://admin:pass@mongo-dev:27017/${dbName}`;
        await mongoose.connect(UrlDb);

        passportConfig(passport);

        server.listen(port, () => {
            console.log(`Сервер запущен на порту ${port}`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();
