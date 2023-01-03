import { getUserByEmail } from "~/models/user.server";
import { validateEmail } from "~/utils";

function isValidTitle(value : string) {
  return value && value.trim().length > 0 && value.trim().length <= 30;
}

function isValidAmount(value : string) {
  const amount = parseFloat(value);
  return !isNaN(amount) && amount > 0;
}

function isValidDate(value : Date) {
  return value && new Date(value).getTime() < new Date().getTime();
}

export async function validateNewUser ({email, password} : {email: string ,password:string}){
  let validationErrors : any = {};

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    validationErrors.email = "A user already exists with this email";
  }

  if (!validateEmail(email)) {
    validationErrors.email =  "Email is invalid";
  }

  if (password.length === 0) {
    validationErrors.email = "Password is required" ;
  }

  if (password.length < 8) {
    validationErrors.email = "Password is too short" ;
  }

  if (Object.keys(validationErrors).length > 0) {
    throw validationErrors;
  }
}

export function validateExpenseInput(input:any) {
  let validationErrors : any = {};

  if (!isValidTitle(input.title)) {
    validationErrors.title = 'Invalid expense title. Must be at most 30 characters long.'
  }

  if (!isValidAmount(input.amount)) {
    validationErrors.amount = 'Invalid amount. Must be a number greater than zero.'
  }

  if (!isValidDate(input.date)) {
    validationErrors.date = 'Invalid date. Must be a date before today.'
  }

  if (Object.keys(validationErrors).length > 0) {
    throw validationErrors;
  }
}