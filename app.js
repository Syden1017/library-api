const express = require('express')
const path = require('path')
const booksRouter = require('./routes/books')
const app = express()
const PORT = process.env.PORT || 3000

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send("Welcome to the Book API!")
})

app.use('/api/books', booksRouter)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
