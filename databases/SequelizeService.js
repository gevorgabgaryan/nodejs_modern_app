import Sequelize from 'sequelize'
import Config from '../config'
import Models from '../models/sequelize'
import logger from '../shared/logger'

class SequelizeService {
  static async init () {
    try {
      const sequelize = new Sequelize(Config.mysql.options)
      sequelize.authenticate()
      logger.info('Successfully connected to MySQL')
      Config.mysql.client = sequelize
      Models(sequelize)
      return sequelize
    } catch (e) {
      logger.info('Sequelize connection error')
      logger.error(e)
      // process.exit(1);
    }
  }
}

export default SequelizeService
