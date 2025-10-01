import bycript from "bcryptjs";

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bycript.genSalt(10);
    return bycript.hash(password, salt);
};

export const comparePassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    return bycript.compare(password, hashedPassword);
};