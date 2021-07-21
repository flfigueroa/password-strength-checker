import axios from "axios";

const password_checker = axios.create({
  baseURL: "https://o9etf82346.execute-api.us-east-1.amazonaws.com/staging",
});

export const PASSWORD_API = {
  password_checker,
};
