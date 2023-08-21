import Validator from 'validator';
import isEmpty from './isEmpty';

interface Errors {
  [key: string]: string;
}

interface ValidationResult {
  errors: Errors;
  isValid: boolean;
}

const validateRegisterInput = (data: any): ValidationResult => {
  const errors: Errors = {};

  // check email field
  if (isEmpty(data.email)) {
    errors.email = "Email field cannot be empty";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid, please provide a valid email";
  }

  // check password field
  if (isEmpty(data.password)) {
    errors.password = "Password field cannot be empty";
  } else if (!Validator.isLength(data.password, { min: 6, max: 150 })) {
    errors.password = "Password must be between 6 and 150 characters long";
  }

  // check name field
  if (isEmpty(data.name)) {
    errors.name = "Name field cannot be empty";
  } else if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters long";
  }

  // check confirm password field
  if (isEmpty(data.confirmPassword)) {
    errors.confirmPassword = "Confirm password field cannot be empty";
  } else if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = "Confirm password doesn't match with password";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export default validateRegisterInput;