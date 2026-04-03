import { Schema, model } from "mongoose";
import { systemRoles } from "../utils/systemRoles.js";
import bcrypt from "bcryptjs";


const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstName is required"],
      minLength: [3, "firstName minimum length is 3 characters"],
      maxLength: [15, "firstName maximum length is 15 characters"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "lastName is required"],
      minLength: [3, "lastName minimum length is 3 characters"],
      maxLength: [15, "lastName maximum length is 15 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      lowercase:true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false,
    },
    age: {
      type: Number,
      required: [true, "age is required"],
    },
    phone: {
      type: String,
      required: [true, "phone is required"],
      unique: [true],
    },
    address: {
      type: String,
      required:[true,"address is required"],
    },
    role: {
      type: String,
      enum: Object.values(systemRoles),
      default: systemRoles.user,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.pre("save", async function(){
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, Number(process.env.SALT_ROUNDS));
});
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = model("User", userSchema);

export default User;
