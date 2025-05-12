require("dotenv").config()
const {
PORT,
jwtKey,
CONNECTION_URL,
Cloud_name,
CloudApi_key,
CloudApi_secret ,
PAYSTACK_PUBLIC_KEY,
PAYSTACK_SECRET_KEY,
REFRESH_TOKEN_SECRET,
JWT_KEY,
} = process.env
module.exports = {
    PORT,
    jwtKey,
    REFRESH_TOKEN_SECRET,
    JWT_KEY,
    CONNECTION_URL,
    Cloud_name,
    CloudApi_key,
    CloudApi_secret,
    PAYSTACK_PUBLIC_KEY,
    PAYSTACK_SECRET_KEY,

}