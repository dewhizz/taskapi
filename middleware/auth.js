const jwt=require('jsonwebtoken')

// load the secret key used to verify tokens from .env
const JWT_SECRET=process.env.JWT_SECRET

// middle ware function
function auth (req,res,next){
// get the authorizarion header
const authHeader=req.headers.authorization
console.log('authHeader',authHeader)

// extracting the token from the authHeader
const token = authHeader&&authHeader.split(' ')[1]
if(!token)return res.status(401).json({message:'no token provided'})
    try {
        // verify the token using the secret key
        // if the token is valid decode it and store the user info in req.user
        const decode=jwt.verify(token,JWT_SECRET)
        console.log(decode)
        req.user=decode
        // allow the request to proceed to the next route handler
        next()
    } catch (error) {
        res.status(403).json({message:'invalid token'})
    }
}
    // exports
    module.exports=auth