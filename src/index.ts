//Import
import { logger } from './logger'

import { join } from 'path'
import { readFile } from 'fs'
import { sign, Secret, SignOptions, verify, JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

import { Express } from 'express'

const express = require('express')
const cors = require('cors')

//Setting
const PORT = process.env.PORT || 80
const PUBLICKKEYPATH = process.env.PUBLICKEYPATH || join(__dirname, '..', 'keys', 'publicKey.pem')
const PRIVATEKEYPATH = process.env.PUBLICKEYPATH || join(__dirname, '..', 'keys', 'privateKey.pem')

//Read publicKey
let PUBLIC_KEY:Secret
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
let PRIVATE_KEY:Secret
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
    //Check Require Params
    if (!req.body.accountId || !req.body.password) {
        res.status(400).json({
            status: 'error',
            details: "Did can't get require params"
        })
        return
    }

    //Check Params
    //Demo Contents
    if (req.body.accountId === 'sus' &&
        req.body.password === 'suwarika')
    {
        //Create Token
        const body = {
            accountId: req.body.accountId
        }
        const options: SignOptions = {
            algorithm: 'RS512',
            expiresIn: '15m'
        }
        const token = sign(body, PRIVATE_KEY, options)

        res.status(201).json({
            status: 'success',
            details: 'Success to login and create token',
            data: {
                token: token
            }
        })
    } else {
        res.status(400).json({
            status: 'error',
            details: "Either params content didn't match"
        })
    }
})

app.get('/check', (req, res) => {
    if (!req.headers['authorization']?.split(" ")[1]) {
        res.status(400).json({

        })
        return
    }
    const token = req.headers['authorization'].split(" ")[1]
    
    //Check Key
    try {
        const decodeBody = verify(token , PUBLIC_KEY, { algorithms: ['RS512'] })
        res.status(200).json(decodeBody)
    } catch(e) {
        if (e instanceof TokenExpiredError) {
            logger.debug("Expried Error")
            res.status(403).json({
                status: "warn",
                details: "Token is expried"
            })
        } else if (e instanceof JsonWebTokenError) {
            logger.debug("Invalid Error")
            res.status(403).json({
                status: "warn",
                details: "Token is invalid"
            })
        } else {
            logger.error("Unknown error occurred!")
            logger.error(e)
            res.status(500).json({
                status: 'error',
                details: 'Unknown error occurred'
            })
        }
    }
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