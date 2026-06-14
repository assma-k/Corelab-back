const { z } = require('zod');

const lessonSchema = z.object({
    title: z.string().min(3, "Titre trop court"),
    courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID cours invalide"),
    htmlContent: z.string().optional(),
    order: z.number().optional()
});

module.exports = { lessonSchema };