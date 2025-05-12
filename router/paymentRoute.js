const express = require("express");
const router = express.Router();
const {verifyPayment,createPayment, requestKey} = require("../controllers/paystack");
const { check } = require("express-validator");

  const registerValMiddleware = [
    check("firstName", "Enter firstname").not().isEmpty(),
    check("email", "Enter a valid email").not().isEmpty().isEmail(),
    check("lastName", "Enter lastname").not().isEmpty(),
    check("address", "Enter address").not().isEmpty(),
    check("phoneNumber", "Enter a valid phone number").not().isEmpty().isMobilePhone() ,
    check("region", "Please select a valid region").not().isEmpty()
];

router.post("/payment", registerValMiddleware ,createPayment)
router.get("/verifyPayment/:reference",verifyPayment)
router.get("/key",requestKey)
module.exports =router