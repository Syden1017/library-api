const express = require('express')

const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())

let books = []

app.get("/", (req, res) => {
    res.send("Welcome to the Book API!");
})

app.post("/api/user/login", (req, res) => {
    res.status(201).json({ id: 1, mail: "test@mail.ru" })
})

app.get("/api/books", (req, res) => {
    res.json(books)
})

app.get("/api/books/:id", (req, res) => {
    const book = books.find(b => b.id === req.params.id)
    if (!book) {
        return res.status(404).send("Book not found")
    }
    res.json(book)
})

app.post("/api/books", (req, res) => {
    const newBook = {
        id: String(books.length + 1),
        title: req.body.title,
        description: req.body.description,
        authors: req.body.authors,
        favorite: req.body.favorite,
        fileCover: req.body.fileCover,
        fileName: req.body.fileName
    }
    books.push(newBook)
    res.status(201).json(newBook)
})

app.put("/api/books/:id", (req, res) => {
    const idx = books.findIndex(b => b.id === req.params.id)
    if (idx === -1) {
        return res.status(404).send("Book not found")
    }
    const updatedBook = {
        id: req.params.id,
        title: req.body.title,
        description: req.body.description,
        authors: req.body.authors,
        favorite: req.body.favorite,
        fileCover: req.body.fileCover,
        fileName: req.body.fileName
    }
    books[idx] = updatedBook
    res.json(updatedBook)
})

app.delete("/api/books/:id", (req, res) => {
    const idx = books.findIndex(b => b.id === req.params.id)
    if (idx === -1) {
        return res.status(404).send("Book not found")
    }
    books.splice(idx, 1)
    res.send("ok")
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})