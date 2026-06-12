const zod = require('zod');

const regist = zod.object({
    email : zod.string().email({ message: "Format d'email invalide" }),
    password: zod.string().min(9, { message: "Le mot de passe doit contenir au moins 9 caractères" }),
    firstName: zod.string().min(2),
    lastName: zod.string().min(2)
});

const log = zod.object({
    email : zod.string().email({ message: "Format d'email invalide" }),
    password: zod.string().min(9, { message: "Le mot de passe doit contenir au moins 9 caractères" }),
});

const updatePass = zod.object({
    newPassword: zod.string().min(9, { message: "Le mot de passe doit contenir au moins 9 caractères" })
});

module.exports = {regist, log, updatePass};