const mongoose = require("mongoose");
const {CONNECTION_URL}=require("../config/env")
const connect =
mongoose.connect(CONNECTION_URL)

  .then((res) => {
    console.log("Database connected")
  })
  .catch((err) => {
    console.log(`Database  connection ERR :${err}`);
  });
module.exports = connect;
