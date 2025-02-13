const express = require("express")
const router = express.Router()
const { uploadBook } = require("../middleware/upload")
const path = require("path")
const Book = require('../models/books')

router.get("/", async (req, res) => {
    const books = await Book.find()
    res.render("index", { books })
})

router.get('/create', (req, res) => {
    res.render('create')
})

router.post("/", uploadBook, async (req, res) => {
    const { title, description, authors, favorite } = req.body
    const newBook = new Book({
        id: Date.now().toString(),
        title,
        description,
        authors,
        favorite: favorite === "true",
        fileCover: req.file ? `/uploads/${req.file.filename}` : "",
        fileName: req.file ? req.file.filename : "",
    })
    await newBook.save()
    res.redirect("/api/books")
})

router.get("/:id", async (req, res) => {
    const book = await Book.findOne({ id: req.params.id })
    if (book) {
        res.render("view", { book })
    } else {
        res.status(404).json({ message: "Book not found" })
    }
})

router.post("/update/:id", uploadBook, async (req, res) => {
    const { id } = req.params
    const { title, description, authors, favorite } = req.body

    const updatedBook = await Book.findOneAndUpdate(
        { id },
        {
            title,
            description,
            authors,
            favorite: favorite === "true",
            fileCover: req.file ? `/uploads/${req.file.filename}` : undefined,
            fileName: req.file ? req.file.filename : undefined,
        },
        { new: true }
    )

    if (updatedBook) {
        res.redirect("/api/books")
    } else {
        res.status(404).json({ message: "Book not found" })
    }
})

router.post("/:id/delete", async (req, res) => {
    const { id } = req.params
    await Book.deleteOne({ id })
    res.redirect("/api/books")
})

router.get("/:id/download", async (req, res) => {
    const book = await Book.findOne({ id: req.params.id })
    if (book) {
        const filePath = path.join(__dirname, '..', book.fileName)
        res.download(filePath, path.basename(book.fileName), (err) => {
            if (err) {
                res.status(500).send({ message: "Could not download the file." })
            }
        })
    } else {
        res.status(404).json({ message: "Book not found" })
    }
})

router.get("/update/:id", async (req, res) => {
    const book = await Book.findOne({ id: req.params.id })
    if (book) {
        res.render("update", { book })
    } else {
        res.status(404).json({ message: "Book not found" })
    }
})

module.exports = router
