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
const passportConfig = require("./config/passport");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/books", booksRouter);
app.use("/api/user", userApiRouter);
app.use("/api/books", booksApiRouter);

app.use(errorMiddleware);

const port = process.env.PORT || 3000;
const dbName = process.env.DB_NAME || "db";

async function start() {
    try {
        const UrlDb = `mongodb://admin:pass@mongo-dev:27017/${dbName}`;
        await mongoose.connect(UrlDb);

        passportConfig(passport);

        app.listen(port, () => {
            console.log(`Сервер запущен на порту ${port}`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();