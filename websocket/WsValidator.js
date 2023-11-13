import {joiOtions as options} from "../utils/constants.js";

export class WsValidator {
  constructor() {
    this.schemasList = {};
  }

  addSchema(schemaName, schema) {
    this.schemasList[schemaName] = schema;
  }

  validate(params, schemaName) {
    const schema = this.schemasList[schemaName];
    if (!schema) {
      throw new Error("Invalid schema name");
    }

    const {error} = schema.validate(params, options);
    if (error) {
      console.error("Validation error:", error.details);
      return {error: error.details};
    }
    return {error: null};
  }
}
