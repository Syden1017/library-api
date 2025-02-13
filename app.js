const express = require("express")
const mongoose = require("mongoose")

const booksApiRouter = require("./routes/books")

const app = express()
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Welcome to the Book API!")
})

app.use('/api/books', booksApiRouter)

async function start(PORT) {
    try {
        await mongoose.connect('mongodb://mongo-express')
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`)
        })
    } catch (error) {
        console.log(error);
    }
}

const PORT = process.env.PORT || 3000

start(PORT)