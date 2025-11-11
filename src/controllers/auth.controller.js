import jwt from "jsonwebtoken";

const default_user = {
    id: 1,
    email : "jcl@gmail.com",
    password : "jcl"
}

export const login = (req, res) => {
    // console.log(req.body);

    const { email, password } = req.body;

    const user = { id : 1}; // puedo agreagar el email, NUNCA el password

    if (email == default_user.email && password == default_user.password) {
        const payload = { user };
        const expiration = { expiresIn: "1h" };

        const token = jwt.sign(payload, process.env.JWT_secret, expiration);
        
        res.json(token);
    } else {
        return res.status(401).send(); // 401 - NO esta autorizado
    }
   
    //res.json({mensaje: "Ok"});
};