const express = require("express");
const router = express.Router();

const { AdminSignup } = require("../controllers/adminUser");


router.post("/register",AdminSignup)

module.exports = router;
