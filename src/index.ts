//Import
import { Express } from 'express'

const express = require('express')
const cors = require('cors')

//Setting
const PORT = process.env.PORT || 80

//Create express Instance
const app:Express = express()
app.use(express.json({ limit: 200000 }))
app.use(express.urlencoded({ limit: 200000, extended: true }))
app.use(cors())

//Logging
app.all('*', (req, res) => {
    console.log(req.originalUrl)
    res.status(200).send("[" + req.method + "] " + req.originalUrl)
})


//Start app
app.listen(PORT, () => {
    console.log("Server Started!")
    console.log("Listening Port: " + PORT)
})