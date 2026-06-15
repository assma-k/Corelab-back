const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const Assignment = require('../models/Assignment');
const Cohort = require('../models/Cohort');
const Progress = require('../models/Progress');
const mongoose = require('mongoose');

async function getAssignedCourses(req, res) {
    try {
        const studentId = req.user.id;
        
        // 1. Trouver les cohortes de l'étudiant
        const cohorts = await Cohort.find({ students: studentId });
        const cohortIds = cohorts.map(c => c._id);
        
        // 2. Trouver les assignations (pour l'étudiant ou ses cohortes)
        const assignments = await Assignment.find({
            $or: [
                { assignedToUser: studentId },
                { assignedToCohort: { $in: cohortIds } }
            ]
        }).populate('courseId');
        
        // 3. Récupérer la progression pour ces cours
        const coursesWithProgress = await Promise.all(assignments.map(async (assignment) => {
            const course = assignment.courseId;
            if (!course) return null;
            
            const progress = await Progress.findOne({ userId: studentId, courseId: course._id });
            const completedCount = progress ? progress.completedLessons.length : 0;
            const totalLessons = course.lessons.length;
            const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
            
            return {
                course,
                progress: {
                    completedLessons: completedCount,
                    totalLessons,
                    percentage
                }
            };
        }));
        
        res.status(200).json(coursesWithProgress.filter(c => c !== null));
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des cours assignés", error: error.message });
    }
}

async function getLesson(req, res) {
    const { courseId, lessonId } = req.params;
    const studentId = req.user.id;
    
    try {
        // Vérifier l'accès au cours (assignation)
        const cohorts = await Cohort.find({ students: studentId });
        const cohortIds = cohorts.map(c => c._id);
        
        const assignment = await Assignment.findOne({
            courseId,
            $or: [
                { assignedToUser: studentId },
                { assignedToCohort: { $in: cohortIds } }
            ]
        });
        
        if (!assignment) {
            return res.status(403).json({ message: "Vous n'avez pas accès à ce cours." });
        }
        
        // Verrouillage temporel
        if (assignment.lessonUnlockDates && assignment.lessonUnlockDates.length > 0) {
            const unlockData = assignment.lessonUnlockDates.find(l => l.lessonId.toString() === lessonId);
            if (unlockData && unlockData.unlockDate) {
                if (new Date() < new Date(unlockData.unlockDate)) {
                    return res.status(403).json({ 
                        message: "Cette leçon est verrouillée.",
                        unlockDate: unlockData.unlockDate 
                    });
                }
            }
        }
        
        const lesson = await Lesson.findById(lessonId);
        if (!lesson) return res.status(404).json({ message: "Leçon introuvable" });
        
        res.status(200).json(lesson);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de la leçon", error: error.message });
    }
}

async function completeLesson(req, res) {
    const { courseId, lessonId } = req.params;
    const studentId = req.user.id;
    
    try {
        let progress = await Progress.findOne({ userId: studentId, courseId });
        
        if (!progress) {
            progress = new Progress({ userId: studentId, courseId, completedLessons: [] });
        }
        
        if (!progress.completedLessons.includes(lessonId)) {
            progress.completedLessons.push(lessonId);
            await progress.save();
        }
        
        res.status(200).json({ message: "Leçon marquée comme terminée.", progress });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de la progression", error: error.message });
    }
}

async function submitQuiz(req, res) {
    const { quizId } = req.params;
    const { answers } = req.body; // Array of { questionId, selectedIndex }
    const studentId = req.user.id;
    
    if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ message: "Veuillez fournir vos réponses au format correct." });
    }
    
    try {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: "Quiz introuvable" });
        
        let correctCount = 0;
        const totalQuestions = quiz.questions.length;
        
        // Evaluation des réponses
        answers.forEach(ans => {
            const question = quiz.questions.id(ans.questionId); // nécessite que le schema ait une ID (par défaut oui en Mongoose)
            if (question && question.correctAnswerIndex === ans.selectedIndex) {
                correctCount++;
            }
        });
        
        const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
        const passed = score >= quiz.passingThreshold;
        
        const quizResult = new QuizResult({
            quizId,
            studentId,
            score,
            passed
        });
        
        await quizResult.save();
        
        res.status(201).json({ 
            message: "Quiz soumis avec succès !", 
            result: quizResult,
            correctCount,
            totalQuestions
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la soumission du quiz", error: error.message });
    }
}

module.exports = { getAssignedCourses, getLesson, completeLesson, submitQuiz };
