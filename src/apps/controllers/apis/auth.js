const CustomerModel = require("../../models/customer")
const jwt = require("jsonwebtoken")
const config = require("config")


const generateAccessToken=(customer)=>{
    return jwt.sign(
        {email:customer.email, password:customer.password},
        config.get("app.jwtAccessKey"),
        {expiresIn:"10s"}
    )
}
const generateRefreshToken=(customer)=>{
    return jwt.sign(
        {email:customer.email, password:customer.password},
        config.get("app.jwtRefreshKey"),
        {expiresIn:"1w"}
    )
}


exports.loginCustomer =async (req,res)=>{
    try {
        const {body} = req
        const customer = await CustomerModel.findOne({email : body.email})
        const validPassword = customer.password === body.password;
        console.log(body.password);
        if(!customer){
            return res.status(401).json("Email not valid")
        }
        if(!validPassword){
            return res.status(401).json("Password not valid")
        }
        if(customer && validPassword){
            console.log(customer);
            const accessToken = generateAccessToken(customer);
            const refreshToken = generateRefreshToken(customer);
            res.cookie("refreshToken", refreshToken)

            const {password, ...others} = customer._doc;
            return res.status(200).json({customer:{...others, accessToken, refreshToken}});
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}
exports.registerCustomers = async (req, res) => {
    try{
        const {body}= req
        const customer = await CustomerModel.findOne({email : body.email})
        if(customer){
            return res.status(401).json("Email is existing")
        }
        const isPhoneExists = await CustomerModel.findOne({phone : body.phone})
        if(isPhoneExists) {return res.status(401).json("Phone already exists")}
        const newCustomer = {
            fullName: body.fullName,
            email: body.email,
            password:  body.password,
            phone: body.phone,
            address: body.address,
        }
        await new CustomerModel(newCustomer).save()
        return res.status(201).json({status:"success", message:"Customer created successfully"})
    }
    catch(error){
        res.status(500).json(error)
    }
}


exports.refreshToken=async(req,res)=>{
    try{
        const {refreshToken} = req.cookies;
        jwt.verify(
            refreshToken,
            config.get("app.jwtRefreshKey"),
            (error,customer)=>{
                if(error) return res.status(401).json("Authentication faild");
                const newAccessToken = generateAccessToken(customer);
                const newRefreshToken = generateRefreshToken(customer);
                return res.status(200).json({
                  
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken
                });
            }
        );

    }catch(error){
        res.status(500).json(error)
    }
}