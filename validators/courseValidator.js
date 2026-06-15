const { z } = require('zod');

//  valider la création d'un cours
const courseSchema = z.object({
    title: z.string().min(3, "Le titre doit faire au moins 3 caractères"),
    description: z.string().min(10, "La description doit faire au moins 10 caractères")
});

// valider l'assignation d'un étudiant à un cours
const assignSchema = z.object({
    courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de cours invalide"),
    studentId: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID d'étudiant invalide")
});

module.exports = { courseSchema, assignSchema };