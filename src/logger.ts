//Import
import { Logger } from 'log4js'
import { join } from 'path'
const log4js = require('log4js')

//Setting config
const LOGLEVEL = process.env.LOGLEVEL || 'debug'
log4js.configure({
    appenders: {
        console: {
            type: "stdout",
        },
        fileOut: {
            type: "file",
            filename: join(__dirname, '..', 'logs', 'authSystem.log'),
            pattern: "-yyyyMMdd"
        },
    },
    categories: {
        default: {
            appenders: [
                "console",
                "fileOut"
            ],
            level: LOGLEVEL
        },
    },
});

//Create Instance
const logger:Logger = log4js.getLogger('AuthSystem')

export { logger }