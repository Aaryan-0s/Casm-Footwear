const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}[\]:;<>,.?~\\-])/;


const passwordHistorySchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxlength: [18, "Name cannot exceed 30 charcters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a Valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minlength: [8, "Password should be greater than 8 charcters"],
    
    validate: {
      validator: function (value) {
        return passwordRegex.test(value);
      },
      message:
        "Password must include a combination of: Uppercase letters, Lowercase letters, Numbers, Special characters (e.g., !, @, #, $)",
    },
    select: false,
  },
  passwordHistory: [passwordHistorySchema],
  failedLoginAttempts: {
    type: Number,
    default: 0,
  },
  accountLocked: {
    type: Boolean,
    default: false,
  },
  lastFailedLoginAttempt: {
    type: Date,
    default: null,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastPasswordChange: {
    type: Date,
    default: Date.now,
  },
  passwordExpiration: {
    type: Date,
    default: function () {
      return new Date(+this.lastPasswordChange + 2 * 24 * 60 * 60 * 1000); // 2 days from last password change
    },
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Check if the new password exists in the password history
   
    if (this.passwordHistory && this.passwordHistory.length > 0) {
      const newPassword = this.password;
     
     

      // Compare new hashed password with hashed passwords in password history
      
      const foundOldPassword = this.passwordHistory.some((passwordRecord) => {
       
        return bcrypt.compareSync(newPassword, passwordRecord.password);
      });
      console.log(foundOldPassword)

      if (foundOldPassword) {
        const error = new Error("This is an old password. Please choose a new one.");
        return next(error);
      }
    }

    // Save current password to password history
    if (this.password) {
      this.lastPasswordChange = Date.now();
      this.passwordExpiration = new Date(+this.lastPasswordChange + 90 * 24 * 60 * 60 * 1000);

      const hashedPassword = await bcrypt.hash(this.password, 10)
      const passwordRecord = {
        password: hashedPassword,
        createdAt: Date.now(),
      };
      if (!this.passwordHistory) {
        this.passwordHistory = [passwordRecord];
      } else {
        this.passwordHistory.push(passwordRecord);
      }
    }

    // Hash the new password and save it
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// JWT tOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  //Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");
  //Hashing and adding resetPasswordToken to UserSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
