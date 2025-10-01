import { Schema, model } from "mongoose";
import type { IUser } from "../types/User";


const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    rol: {type: String, enum: ["admin", "user"], default: "user"}
})

export const User = model<IUser>("User", userSchema);