const jsonwebtoken = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const autorisation = req.headers.authorization;
    if(!autorisation || !autorisation.startsWith('Bearer ')){
        res.status(401).json({ message : 'token manquant'});
    }
    const token = autorisation.split(' ')[1];
    try{
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(error){
        res.status(401).json({ message: 'Jeton invalide ou expiré', error: error.message });
    }
}

function isAdmin(req, res, next) {
    if(req.user && req.user.role == 'admin') {
        next();
    }else {
        res.status(403).json({ message: "Accès refusé. Droits d'administrateur requis." });
    }
}

module.exports = { verifyToken, isAdmin };