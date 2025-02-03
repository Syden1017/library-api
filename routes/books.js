const express = require("express")
const router = express.Router()
const { uploadBook } = require("../middleware/upload")
const path = require("path")

let books = []

router.get("/", (req, res) => {
    res.render("index", { books })
})

router.get('/create', (req, res) => {
    res.render('create')
})

router.post("/", uploadBook, (req, res) => {
    const { title, description, authors, favorite } = req.body
    const newBook = {
        id: Date.now().toString(),
        title,
        description,
        authors,
        favorite: favorite === "true",
        fileCover: req.file ? `/uploads/${req.file.filename}` : "",
        fileBook: req.file ? `/uploads/${req.file.filename}` : "",
    }
    books.push(newBook)
    res.redirect("/api/books")
})

router.get("/:id", (req, res) => {
    const book = books.find((b) => b.id === req.params.id)
    if (book) {
        res.render("view", { book })
    } else {
        res.status(404).json({ message: "Book not found" })
    }
})

router.post("/update/:id", uploadBook, (req, res) => {
    const { id } = req.params
    const { title, description, authors, favorite } = req.body
    const idx = books.findIndex((b) => b.id === id)

    if (idx !== -1) {
        const updatedBook = {
            ...books[idx],
            title,
            description,
            authors,
            favorite: favorite === "true",
            fileCover: req.file ? `/uploads/${req.file.filename}` : books[idx].fileCover,
            fileBook: books[idx].fileBook,
        }
        books[idx] = updatedBook
        res.redirect("/api/books")
    } else {
        res.status(404).json({ message: "Book not found" })
    }
})

router.post("/:id/delete", (req, res) => {
    const { id } = req.params
    books = books.filter((b) => b.id !== id)
    res.redirect("/api/books")
})

router.get("/:id/download", (req, res) => {
    const book = books.find((b) => b.id === req.params.id)
    if (book) {
        const filePath = path.join(__dirname, '..', book.fileBook)
        res.download(filePath, path.basename(book.fileBook), (err) => {
            if (err) {
                res.status(500).send({ message: "Could not download the file." })
            }
        })
    } else {
        res.status(404).json({ message: "Book not found" })
    }
})

router.get("/update/:id", (req, res) => {
    const book = books.find((b) => b.id === req.params.id)
    if (book) {
        res.render("update", { book })
    } else {
        res.status(404).json({ message: "Book not found" })
    }
})

module.exports = router
