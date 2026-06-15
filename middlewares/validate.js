// Middleware de validation
function validate(zod) {
    return function(req, res, next) {
        //on verifie que le body est valide
        try {
            zod.parse(req.body);
            next();
        }catch(error){
            res.status(400).json({details: error.errors})
        }
    };
}

module.exports = validate;