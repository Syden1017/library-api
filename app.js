const express = require("express");
const mongoose = require("mongoose");
const errorMiddleware = require("./middleware/error");
const indexRouter = require("./routes/index");
const booksRouter = require("./routes/books");
const userApiRouter = require("./routes/api/user");
const booksApiRouter = require("./routes/api/books");

const app = express();

app.set("view engine", "ejs");

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

        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();