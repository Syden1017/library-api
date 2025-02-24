const router = require("express").Router();
const fileMiddleware = require("../middleware/file");

const Book = require("../models/Book");

const props = [
    "title",
    "description",
    "authors",
    "favorite",
    "fileCover",
    "fileName",
];

router.get("/view", async (_req, res) => {
    const books = await Book.find();

    res.render("books/index", { title: "Книги", books: books });
});

router.get("/view/:id", async (req, res) => {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (book) {
        res.render("books/view", {
            title: "Просмотр книги",
            book,
        });
    } else {
        res.status(404).redirect("/404");
    }
});

router.get("/create", (_req, res) => {
    res.render("books/create", { title: "Добавление книги", book: {} });
});

router.post("/create", fileMiddleware.single("fileBook"), async (req, res) => {
    const newBook = {};

    const { body, file } = req;

    props.forEach((p) => {
        if (body[p] !== undefined) {
            newBook[p] = body[p];
        }
    });

    if (file) {
        newBook.fileBook = file.path;
    }

    try {
        const book = new Book(newBook);

        await book.save();

        res.redirect("/books/view");
    } catch (e) {
        console.error(e);
    }
});

router.get("/update/:id", async (req, res) => {
    const { id } = req.params;
    let book = await Book.findById(id);

    if (book) {
        res.render("books/update", {
            title: "Редактирование книги",
            book,
        });
    } else {
        res.status(404).redirect("/404");
    }
});

router.post(
    "/update/:id",
    fileMiddleware.single("fileBook"),
    async (req, res) => {
        const { id } = req.params;
        let book = await Book.findById(id);

        if (book) {
            const { body, file } = req;

            props.forEach((p) => {
                if (body[p] !== undefined) {
                    book[p] = body[p];
                }
            });

            if (file) {
                book.fileBook = file.path;
            }

            res.redirect("/books/view/" + id);
        } else {
            res.status(404).redirect("/404");
        }
    }
);

router.post("/delete/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await Book.deleteOne({ _id: id });
        res.status(200).redirect("/books/view");
    } catch (e) {
        console.error(e);
        res.status(404).redirect("/404");
    }
});

module.exports = router;