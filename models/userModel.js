const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        default: "",
    },
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCKED", "DELETED",],
        default: "ACTIVE",
    },
},
    { timestamps: true });

userSchema.plugin(mongoosePaginate);
userSchema.plugin(aggregatePaginate);

const User = mongoose.model('User', userSchema);

module.exports = User;

