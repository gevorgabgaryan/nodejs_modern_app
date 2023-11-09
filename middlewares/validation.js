import {registerBodySchema, loginBodySchema, verifyParamsSchema} from "../validators/authValidator";

export const validateRegisterData = (req, res, next) => {
  _validationHandler(req, res, next, registerBodySchema);
};

export const validateLoginData = (req, res, next) => {
  _validationHandler(req, res, next, loginBodySchema)
}

export const validateVerifyData= (req, res, next) => {
    _validationHandler(req, res, next, null, null, verifyParamsSchema)
  }

const _validationHandler = (
  req,
  res,
  next,
  bodySchema,
  querySchema,
  paramsSchema
) => {
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: false, // ignore unknown props
    stripUnknown: false, // remove unknown props
  };
  try {
    if (bodySchema) {
      const hasError = _checkSchema(res, bodySchema, req.body, options, "body");
      if (hasError) {
        return;
      }
    }
    if (querySchema) {
      const hasError = _checkSchema(
        res,
        querySchema,
        req.query,
        options,
        "query"
      );
      if (hasError) {
        return;
      }
    }
    if (paramsSchema) {
      const hasError = _checkSchema(
        res,
        paramsSchema,
        req.params,
        options,
        "params"
      );
      if (hasError) {
        return;
      }
    }
    next();
  } catch (e) {
    console.log(e);
    res.json({
      status: false,
      error: true,
      message: "System error",
    });
  }
};

const _checkIsObjExist = (obj) => {
  if (obj && Object.keys(obj).length) {
    return true;
  } else {
    return false;
  }
};

const _checkSchema = (res, schema, obj, options, schemaName) => {
  if (!_checkIsObjExist(obj)) {
    return res.json({
      status: false,
      error: true,
      message: `Request ${schemaName} required`,
    });
    return true;
  }
  const {error} = schema.validate(obj, options);
  if (error) {
    res.json({
      status: false,
      error: true,
      message: "Validation error",
      details: error.details,
    });
    return true;
  }
  return false;
};
