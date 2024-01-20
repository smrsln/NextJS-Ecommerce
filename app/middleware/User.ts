// middleware/User.ts
import bcrypt from "bcrypt";
import { User } from "../models/User";

User.schema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

User.schema.methods.comparePassword = function (
  candidatePassword: string
): Promise<boolean> {
  const password = this.password;
  return bcrypt.compare(candidatePassword, password);
};
