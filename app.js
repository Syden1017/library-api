const express = require('express');
const booksRouter = require('./routes/books');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Welcome to the Book API!");
});

app.post("/api/user/login", (req, res) => {
    res.status(201).json({ id: 1, mail: "test@mail.ru" });
});

app.use('/api/books', booksRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
