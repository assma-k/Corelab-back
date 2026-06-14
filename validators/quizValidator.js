const  zod  = require('zod');

const thresholdSchema = zod.object({
    threshold: zod.number().min(0).max(100)
});

const quizSchema = zod.object({
    title: zod.string().min(3),
    threshold: zod.number().min(0).max(100).optional(),
    questions: zod.array(zod.object({
        text: zod.string(),
        options: zod.array(zod.string()),
        correctAnswers: zod.array(zod.number())
    }))
});

module.exports = { thresholdSchema, quizSchema };