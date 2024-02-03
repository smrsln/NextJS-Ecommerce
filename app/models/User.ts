// models/User.ts
import mongoose from "mongoose";
import { IUser, IUserModel } from "@/app/types/User";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => {
          return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password should be longer!"],
    },
    name: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.comparePassword = function (
  candidatePassword: string
): Promise<boolean> {
  const password = this.password;
  return bcrypt.compare(candidatePassword, password);
};

UserSchema.statics.createUser = async function (
  email: string,
  password: string
) {
  // Check if a user with the given email already exists
  const existingUser = await this.findOne({ email });
  if (existingUser) {
    throw new Error("A user with this email already exists");
  }
  // Create a new user
  const user = new this({ email, password });
  await user.save();
  return user;
};

UserSchema.statics.signIn = async function (email: string, password: string) {
  // Find the user by email
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("No user found with this email");
  }

  // Validate the password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid password");
  }

  // Convert the Mongoose document to a plain JavaScript object
  const userObject = user.toObject();

  // Delete the password property
  delete userObject.password;

  return userObject;
};

export const User: IUserModel =
  (mongoose.models.User as IUserModel) ||
  mongoose.model<IUser, IUserModel>("User", UserSchema);
