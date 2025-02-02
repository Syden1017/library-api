const express = require("express")
const router = express.Router()
const { uploadBook } = require("../middleware/upload")

let books = []

router.get("/", (req, res) => {
    res.json(books)
})

router.get("/:id", (req, res) => {
    const book = books.find(b => b.id === req.params.id)
    if (!book) {
        return res.status(404).send("Book not found")
    }
    res.json(book)
})

router.post('/', uploadBook, (req, res) => {
    const newBook = {
        id: String(books.length + 1),
        title: req.body.title,
        description: req.body.description,
        authors: req.body.authors,
        favorite: req.body.favorite === 'true',
        fileCover: req.file.path,
        fileName: req.file.originalname,
        fileBook: req.file.path
    };
    books.push(newBook);
    res.status(201).json(newBook);
});

router.put('/:id', (req, res) => {
    const idx = books.findIndex(b => b.id === req.params.id);
    if (idx === -1) {
        return res.status(404).send("Book not found");
    }
    const updatedBook = {
        id: req.params.id,
        title: req.body.title,
        description: req.body.description,
        authors: req.body.authors,
        favorite: req.body.favorite === 'true',
        fileCover: req.body.fileCover,
        fileName: req.body.fileName,
        fileBook: books[idx].fileBook
    };
    books[idx] = updatedBook;
    res.json(updatedBook);
});

router.delete('/:id', (req, res) => {
    const idx = books.findIndex(b => b.id === req.params.id);
    if (idx === -1) {
        return res.status(404).send("Book not found");
    }
    books.splice(idx, 1);
    res.send("ok");
});

router.get('/:id/download', (req, res) => {
    const book = books.find(b => b.id === req.params.id);
    if (book) {
        const filePath = book.fileBook;
        res.download(filePath, book.fileName, (err) => {
            if (err) {
                res.status(500).send({ message: 'Could not download the file.' });
            }
        });
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

module.exports = router;