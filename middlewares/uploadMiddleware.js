// Middleware d'upload
const multer = require('multer');
const storage = multer.diskStorage({
destination: function (req, file, cb) { 
    cb(null, 'uploads/');
},

//nom du fichier
filename: function (req, file, cb) { 
    //on ajoute la date et le nom du fichier
    cb(null, Date.now() + '-' + file.originalname); 
}
});
//configuration de multer
const upload = multer({ storage: storage});
module.exports = upload;
