const jsonwebtoken = require('jsonwebtoken');

// Middleware pour vérifier le token
function verifyToken(req, res, next) {
    //on recupere le token
    const autorisation = req.headers.authorization;
    if(!autorisation || !autorisation.startsWith('Bearer ')){
        res.status(401).json({ message : 'token manquant'});
    }
    //on verifie que le token est valide
    const token = autorisation.split(' ')[1];
    try{
        //on decode le token
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        //on ajoute l'utilisateur au request
        req.user = decoded;
        next();
    }catch(error){
        res.status(401).json({ message: 'Jeton invalide ou expiré', error: error.message });
    }
}

// Middleware pour vérifier que l'utilisateur est admin
function isAdmin(req, res, next) {
    //on verifie que l'utilisateur est admin
    if(req.user && req.user.role == 'admin') {
        next();
    }else {
        res.status(403).json({ message: "Accès refusé. Droits d'administrateur requis." });
    }
}

module.exports = { verifyToken, isAdmin };