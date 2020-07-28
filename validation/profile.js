const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validatePasswordChange(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.oldpassword = !isEmpty(data.oldpassword) ? data.oldpassword : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  const empty1 = Validator.isEmpty(data.oldpassword);
  const empty2 = Validator.isEmpty(data.password);
  const empty3 = Validator.isEmpty(data.password2);

  if (empty1 && empty2 && empty3) {
    
  } else if (empty1 || empty2 || empty3) {
    errors.oldpassword = "All password fields are required";
  }

  else if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "New password must be at least 6 characters";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
