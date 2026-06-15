const nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");

// On utilise le Token depuis le .env
const TOKEN = process.env.MAILTRAP_TOKEN;

const transport = nodemailer.createTransport(
    MailtrapTransport({
        token: TOKEN,
    })
);

// Configuration de l'expéditeur
const sender = {
    address: "hello@demomailtrap.co",
    name: "CoreLab LMS",
};

//email de bienvenue avec le corps du mail vers qui et de qui si + try catch de lenvoie 
async function sendWelcomeEmail(email, firstName, password) {
    try {
        await transport.sendMail({
            from: sender,
            to: [email],
            subject: 'Bienvenue sur CoreLab - Vos identifiants',
            html: `
                <h1>Bonjour ${firstName} !</h1>
                <p>Ton compte étudiant a été créé.</p>
                <p>Voici tes identifiants de connexion :</p>
                <ul>
                    <li><strong>Email :</strong> ${email}</li>
                    <li><strong>Mot de passe temporaire :</strong> ${password}</li>
                </ul>
                <p>Il te sera demandé de changer ce mot de passe lors de ta première connexion.</p>
            `,
            category: "Welcome Email",
        });
        console.log(`Email envoyé via Mailtrap SDK à ${email}`);
    } catch (error) {
        console.error("Erreur lors de l'envoi via Mailtrap SDK :", error);
    }
}

module.exports = { sendWelcomeEmail };