// (?=.*\d): At least one digit (0-9) is required.
// (?=.*[a-z]): At least one lowercase letter (a-z) is required.
// (?=.*[A-Z]): At least one uppercase letter (A-Z) is required.
// [-!@#$%^&*()_+|~={}:";'<>?,./0-9a-zA-Z]`: The password can consist of only the
export const passwordPattern =
  // eslint-disable-next-line no-useless-escape
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[-!@#$%^&*()_+|~=`{}\[\]:";'<>?,.\/0-9a-zA-Z]{6,}$/

export const joiOtions = {
  abortEarly: false, // include all errors
  allowUnknown: false, // ignore unknown props
  stripUnknown: false // remove unknown props
}
