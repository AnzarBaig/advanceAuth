import mongoose from "mongoose"
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import crypto from "crypto";

const schema = new mongoose.Schema({
    username : {
        type : String,
        required : [true, "please provide a username "]
    }, 
    email : {
        type :String,
        unique : true,
        match : [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/, "please provide the correct email ID"
        ]
    },
    password : {
        type : String,
        required : [true , "please add a password"],
        minlength : 6,
        select : false
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date
});

schema.pre('save', async function(next){
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next()
})

schema.methods.matchPasswords = async function (password) {
    return await bcrypt.compare(password , this.password);
}
schema.methods.getSingnedToken = function () {
    return Jwt.sign({ id : this._id }, process.env.JWT_SECRET, {expiresIn : process.env.JWT_EXPIRES})
}

schema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);
    return resetToken;
}


const User = mongoose.model("User", schema)

export default User;