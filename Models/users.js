const mongoose = require("mongoose");
const {isEmail} = require("validator");
const bcrypt = require("bcrypt")




const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required: [true, "Please enter a email"],
        unique: true,
        lowercase:true,
        validate:[isEmail, "Please enter a valid email"]

    },
    password:{
        type:String,
        required: [true, "Please enter a password"],
        minlength:[5, "Minimum password length is 5 characters"]
    }
})

// mongoose hook before a user is saved to db
userSchema.pre("save", async function(next){
    // console.log("user about to be saved", this)
    salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next()
})

// static user to login user
userSchema.statics.login = async function(email, password){
    const user = await this.findOne({ email })
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user
        }   
        throw Error("incorrect password");
        
    }
    throw Error("incorrect email")
}

const User = mongoose.model("user", userSchema);

module.exports = User;