const express = require("express")
const { check, validationResult } = require("express-validator")
const userModel = require("../models/userModel")
const adminModel=require("../models/AdminModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { REFRESH_TOKEN_SECRET,JWT_KEY } = require("../config/env")

const Signup = async (req, res, next) => {
  const { fullname, email,phonenumber, password, confirmpassword } = req.body
  const error = validationResult(req)
  if (!error.isEmpty()) {
    res.json({ error: error.array(),error_type:0,created:false})
    return
  }
  const findoneUser = await userModel.findOne({ email: email })
  if (findoneUser) {
    res.json({ message: "Account already exist" ,error_type:1,created:false})
    return
  }
  if (password !== confirmpassword) {
    res.json({ message: "password do not match" ,error_type:1,created:false})
    return
  }

  try {
    const salt = await bcrypt.genSalt(10)
    const hashedpassword = await bcrypt.hash(password, salt)
    const user = new userModel({
      fullname,
      email,
      phonenumber,
      password: hashedpassword,
    })
    user.save().then((doc) => {
      const id = doc._id
      const token = jwt.sign({ id }, JWT_KEY, { expiresIn: "10d" })
      res
        // .cookie("jwtToken", token)
        .status(201)
        .send({ id, created: true, token ,message:"sucessfilly registered" })
    })

  } catch (error) {
    console.error("Error during user registration:", error)
    res
      .status(500)
      .json({ error: "An error occurred during user registration" })
  }
}

// console.log(REFRESH_TOKEN_SECRET,JWT_KEY )
if (!JWT_KEY || !REFRESH_TOKEN_SECRET) {
  console.error("JWT_KEY or REFRESH_TOKEN_SECRET is not set in the environment variables.")
  process.exit(1)
}

function generateTokens(id, isAdmin) {
  try {
    const accessToken = jwt.sign({ id, isAdmin }, JWT_KEY, { algorithm: 'HS256', expiresIn: '15m' })
    const refreshToken = jwt.sign({ id, isAdmin }, REFRESH_TOKEN_SECRET, { algorithm: 'HS256', expiresIn: '7d' })

   

    return { accessToken, refreshToken }
  } catch (error) {
    console.error("Error generating tokens:", error)
    throw error
  }
}


const Login = async (req, res, next) => {

    const { email, password } = req.body
    const errors = validationResult(req)
    try {
      if (!errors.isEmpty()) {
        return res.json({ errors: errors.array(), error_type: 0, created: false, isLoggedIn: false })
      }
  
      const user = await userModel.findOne({ email: email })
      const admin = await adminModel.findOne({ email: email })
  
      if (!user && !admin) {
        return res.json({ message: "Invalid account", error_type: 1, created: false, isLoggedIn: false })
      }

      let isValid = false
      let isAdmin = false
      let id
  
      if (user) {
        isValid = await bcrypt.compare(password, user.password)
        id = user._id
      } 
      if (admin) {
        isValid = await bcrypt.compare(password, admin.password)
        isAdmin = true
        id = admin._id
      }
  
      if (isValid) {
        const { accessToken, refreshToken } = generateTokens(id, isAdmin)
        return res.json({ message: "Logged in", accessToken, refreshToken, created: true, isLoggedIn: true, isAdmin })
      } else {
        return res.json({ message: "Invalid password",error_type: 1, created: false, isLoggedIn: false })
      }
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "Internal server error", isLoggedIn: false,error_type: 2 })
    }
  }
  

const verifyAccount = async (req, res, next) => {
  res.status(200).json({ message: "verifyacct" })
}



const deleteAllUser=async(req,res)=>{
    try {
        await userModel.deleteMany({})
        res.status(200).json({ message: 'All users deleted successfully.' })
    } catch (error) {
        console.error('Error deleting documents:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}


 const refreshToken=async (req, res) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized: No refresh token provided" })
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET)
    const userId = decoded.id

    let user = await userModel.findOne({ _id: userId })
    if (!user) {
      const admin = await adminModel.findOne({ _id: userId })
      if (!admin) {
        return res.status(401).json({ message: "Unauthorized: User not found refresh" })
      }
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(userId, decoded.isAdmin)
      // console.log(accessToken)
      return res.json({ accessToken, refreshToken: newRefreshToken })
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(userId, decoded.isAdmin)
    res.json({ accessToken, refreshToken: newRefreshToken })
  } catch (error) {
    console.error("Error in refresh token endpoint:", error)
    return res.status(401).json({ message: "auth Unauthorized" })
  }
}

 const getMe = async (req, res) => {
  try {
      if (req.user) {
        const data={
          _id:req.user._id,
          fullname:req.user.fullname,
          email:req.user.email,
          phonenumber:req.user.phonenumber,
          isAdmin:req.user.isAdmin,
        }
          res.json({data})
      } else {
          res.status(404).json({ message: 'User not found 0' })
      }
  } catch (error) {
      console.error('Error fetching user details', error)
      res.status(500).json({ message: 'Internal server error' })
  }
}

 const editUser=async(req, res) => {
  const { fullname = '', password = '', confirmpassword = '', phonenumber = '' } = req.body;
const id = req.params.id;
  const error = validationResult(req)
  
  if (!error.isEmpty()) {
    res.json({ error: error.array(),error_type:0,created:false})
    return
  }
  const user =await userModel.findOne({_id:id});
  if (!user) {
    return res.status(404).json({ error: 'User not found',error_type:1 });
  }
    if (password !== confirmpassword) {
      return res.json({ message: "password do not match" ,error_type:1,created:false})
    }
 try{
    const updatedFields = {};
    if (fullname.trim() !== '') {
      updatedFields.fullname = fullname;
    }
    if (password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updatedFields.password = hashedPassword;
    }
    if (phonenumber.trim() !== '') {
      updatedFields.phonenumber = phonenumber;
    }
    await userModel.findByIdAndUpdate(id, updatedFields);
    return res.json({ message: 'Information updated successfully',created:true });
 }
 catch(error){
console.error(error)
return res.status(500).json({ message: 'Information not updated',error_type:1, created:false });
 }
}

module.exports = {
  Signup,
  Login,
  verifyAccount,
  deleteAllUser,
  refreshToken,
  getMe,
  editUser
}
