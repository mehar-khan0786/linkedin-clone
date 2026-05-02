import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
    try {
        
        const { token } = req.cookies;
        console.log(req.cookies);
        if (!token) {
            return res.status(401).json({
                message: "No token found"
            });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        if(!decoded){
            return res.status(400).json({message:"user doesn't have valid token"});
        }

        req.userId = decoded.userId; 
        next(); 
    } catch (err) {
        return res.status(500).json({
            message: "Invalid token"
        });
    }
};

export default isAuth;