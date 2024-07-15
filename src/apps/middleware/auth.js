const jwt = require('jsonwebtoken');
const config = require('config');
exports.verifyAuthenticationCustomer = (req,res,next)=>{
    const {token} = req.headers; 
    if(token){
    const verifyToken = token.split(" ")[1]
        jwt.verify(verifyToken, config.app.jwtAccessKey, (error, customer)=>{
            if(error) {
                if(error.name ==="TokenExpiredError"){
                    return res.status(200).json({
                        code: 401,
                        message: "Token Expired"
                    });

                }
                return res.status(401).json("Authentication failed")}
            })
            next()
        }
    else{
        return res.status(403).json("Authentication required")
    }
}