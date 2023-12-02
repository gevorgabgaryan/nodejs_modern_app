import axios from 'axios'
import Config from '../config'
import { CustomError } from '../shared/error'
import HttpStatusCode from '../shared/httpStatusCodes'
import logger from '../shared/logger'

class ServiceClient {
  static async getService (servicename) {
    try {
      const res = await axios.get(`${Config.registry.url}/find/${servicename}/${Config.registry.verion}`)
      if (!res.data.result || !res.data.result.ip) {
        throw new CustomError(`Service ${servicename} not found`, 'SERVICE_NOT_FOUND', HttpStatusCode.INTERNAL_SERVER)
      }
      return res.data.result
    } catch (e) {
      const message = (e.response && e.response.data && e.response.data.message) || e.message
      logger.error(message)
      throw new CustomError(message, 'SERVICE_NOT_FOUND', HttpStatusCode.INTERNAL_SERVER)
    }
  }

  static async callService (servicename, requestOptions) {
    const { ip, port } = await ServiceClient.getService(servicename)
    requestOptions.url = `http://${ip}:${port}${requestOptions.url}`
    try {
      const response = await axios(requestOptions)
      return response.data
    } catch (e) {
      const message = (e.response && e.response.data && e.response.data.message) || e.message
      logger.error(message)
      throw new CustomError(message, 'CATALOG_SERVICE', HttpStatusCode.INTERNAL_SERVER)
    }
  }
}

export default ServiceClient
