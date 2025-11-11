import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    console.log(req.headers);
    // next();

    const token = req.headers["authorization"]?.split(" ")[1]; // Aca tomo authorization y divido el Bearer del Token

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_secret, (err) => {
        if (err) return res.sendStatus(403); 
        next();
    });
};