import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";


export const generateToken = (userId:string, rol:string):string => {
    return jwt.sign({ userId, rol }, JWT_SECRET, { expiresIn: "1h" });
}

export const validateToken = (token:string):any =>{
    return jwt.verify(token, JWT_SECRET);
}

