const { Schema, model } = require("mongoose")
const userschema = new Schema(
    {
        fullname: {
            type: Schema.Types.String
        },
        email: {
            type: Schema.Types.String
        },
         password: {
            type: Schema.Types.String
        },
        phonenumber: {
            type: Schema.Types.String
        },
        createdAt: {
            type: Schema.Types.Date

        }
    },
    {
        timestamps: true
    }

)

const usercollections = model("Users", userschema)
module.exports = usercollections
