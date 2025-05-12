const express = require("express");
const router = express.Router();
const { check, body} = require("express-validator");
const { Signup, Login, verifyAccount, deleteAllUser, refreshToken, getMe, editUser } = require("../controllers/users");
const { AdminSignup } = require("../controllers/adminUser");
const auth = require("../middleware/auth");

const registerValMiddleware=[
  check("fullname", "Enter fullname").not().isEmpty(),
    check("email", "Enter email").not().isEmpty().isEmail(),
    check("phonenumber", "phonenumber").not().isEmpty(),
    check("password", "Enter password").not().isEmpty().isLength({ min: 5 }),
    check("confirmpassword", "Enter confirmPassword").not().isEmpty(),
]

router.post("/verifyAccount",verifyAccount);
router.post("/login",  [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password cannot be empty')
],
Login)
router.get('/me',auth,getMe)
router.post(
  "/register",
  [
  ...registerValMiddleware
  ],
  Signup
);
router.delete("/deleteusers",deleteAllUser)
router.post("/refresh-token",refreshToken)
router.post("/user/register",AdminSignup)
router.put("/user/edit/:id",editUser)

module.exports = router;
