//Import
import { logger } from './logger'

import { join } from 'path'
import { readFile } from 'fs'

import { Express } from 'express'

const express = require('express')
const cors = require('cors')

//Setting
const PORT = process.env.PORT || 80
const PUBLICKKEYPATH = process.env.PUBLICKEYPATH || join(__dirname, '..', 'keys', 'publicKey.pem')
const PRIVATEKEYPATH = process.env.PUBLICKEYPATH || join(__dirname, '..', 'keys', 'privateKey.pem')

//Read publicKey
let PUBLIC_KEY:String
readFile(PUBLICKKEYPATH, (e, data) => {
    if (e) {
        logger.error('PublicKeyError:')
        logger.error(e)
        process.exit(1)
    }
    PUBLIC_KEY = data.toString()
    logger.info('Successed to read Public Key File')
})

//Read privateKey
let PRIVATE_KEY:String
readFile(PRIVATEKEYPATH, (e, data) => {
    if (e) {
        logger.error('PrivateKeyError:')
        logger.error(e)
        process.exit(1)
    }
    PRIVATE_KEY = data.toString()
    logger.info('Successed to read Private Key File')
})

//Create express Instance
const app:Express = express()
app.use(express.json({ limit: 200000 }))
app.use(express.urlencoded({ limit: 200000, extended: true }))
app.use(cors())

//Logging
app.all('*', (req, res, next) => {
    logger.info(req.method + ": " + req.originalUrl + "|" + req.ip)
    next()
})

//MainSystem
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'Success',
        details: 'Server is working'
    })
})

app.post('/login', (req, res) => {
    res.status(500).json({
        status: 'error',
        details: 'No coding'
    })
})

app.get('/check', (req, res) => {
    res.status(500).json({
        status: 'error',
        details: 'No coding'
    })
})

app.post('/refresh', (req, res) => {
    res.status(500).json({
        status: 'error',
        details: 'No coding'
    })
})

app.get('/publickey', (req, res) => {
    res.status(200).send(PUBLIC_KEY)
})

//Account
//create
app.post('/account', (req, res) => {
    res.status(500).json({
        status: 'error',
        details: 'No coding'
    })
})

//delete
app.delete('/account', (req, res) => {
    res.status(500).json({
        status: 'error',
        details: 'No coding'
    })
})

//edit
app.put('/account', (req, res) => {
    res.status(500).json({
        status: 'error',
        details: 'No coding'
    })
})

//404Error
app.all('*', (req, res) => {
    res.status(404).json({
        status: 'Error',
        details: 'Not Found',
        path: req.method + ":" + req.originalUrl
    })
})

//Start app
app.listen(PORT, () => {
    logger.info("#########################")
    logger.info("SUS-DX Auth System")
    logger.info("Server Start!")
    logger.info("Listening Port: " + PORT)
    logger.info("#########################")
})