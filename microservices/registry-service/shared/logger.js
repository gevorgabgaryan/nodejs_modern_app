import { createLogger, format, transports } from 'winston'

const logger = createLogger({
  transports: [
    new transports.File({
      level: 'warn',
      maxsize: 10000000,
      maxFiles: 5,
      filename: 'logs/warn.log'
    }),
    new transports.File({
      level: 'error',
      maxsize: 10000000,
      maxFiles: 5,
      filename: 'logs/error.log'
    }),
    new transports.File({
      level: 'info',
      maxsize: 10000000,
      maxFiles: 5,
      filename: 'logs/info.log'
    }),
    new transports.File({
      level: 'debug',
      maxsize: 10000000,
      maxFiles: 5,
      filename: 'logs/debug.log'
    })
  ],
  format: format.combine(

    format.timestamp({
      format: 'MMM-DD-YYYY HH:mm:ss'
    }),
    format.printf(info => `${info.level} : ${[info.timestamp]}: ${info.message}`)
  )
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    handleExceptions: true,
    level: 'error'
  }))

  logger.add(new transports.Console({
    handleExceptions: true,
    level: 'info'
  }))
  logger.add(new transports.Console({
    handleExceptions: true,
    level: 'warn'
  }))
}

export default logger
