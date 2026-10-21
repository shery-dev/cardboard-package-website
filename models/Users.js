import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
    minlength: 8,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("Password")) {
    try {
      const saltRound = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(user.Password, saltRound);
      user.Password = hashPassword;
      next();
    } catch (error) {
      console.error("Error hashing password:", error);
      next(new Error("Error hashing password")); // Throw informative error
    }
  } else {
    next();
  }
});

UserSchema.methods.generateToken = function () {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is not set");
    }

    const payload = {
      id: this._id,
      name: this.Name,
      email: this.Email,
      isAdmin: this.isAdmin,
    };
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d", // Set expiration to 1 hour
    });
  } catch (error) {
    return error;
  }
};

const Users = mongoose.models?.User || mongoose.model("User", UserSchema);

module.exports = Users;
