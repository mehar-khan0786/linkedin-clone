import jwt from "jsonwebtoken";

const genToken = (userId) => {
    try {
        const token = jwt.sign(
            { userId }, 
            process.env.SECRET_KEY,
            { expiresIn: "7d" }
        );
        
        return token;
    } catch (err) {
        console.log(err);
    }
};

export default genToken;