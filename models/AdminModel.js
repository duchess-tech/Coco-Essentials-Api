const { Schema, model } = require("mongoose")
const Adminschema = new Schema(
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
        createdAt: {
            type: Schema.Types.Date

        }
    },
    {
        timestamps: true
    }

)

const admincollections = model("Admin", Adminschema)
module.exports = admincollections
