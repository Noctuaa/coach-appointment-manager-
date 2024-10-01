import { body, validationResult } from "express-validator";


/**
 * Middleware de validation générique.
 * Vérifie les erreurs de validation et renvoie une réponse 400 si des erreurs sont présentes.
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express 
 * @param {Function} next - Fonction middleware suivante
 * @returns {void}
*/
const validate = (req, res, next) => {
   const errors = validationResult(req);
   if(errors.isEmpty()) {
      return next();
   }
   return res.status(400).json({ errors: errors.array() });
}

/**
 * Règles de validation pour l'inscription d'un utilisateur.
 * Valide l'email, le mot de passe et la confirmation du mot de passe.
 * 
 * Politique de sécurité des mots de passe :
 * 1. Longueur minimale de 8 caractères
 * 2. Au moins un chiffre
 * 3. Au moins un caractère spécial
 * 4. Au moins une lettre majuscule
 * 5. Au moins une lettre minuscule
 * 6. Le mot de passe de confirmation doit correspondre au mot de passe original
 * 
 */
export const validateSignup = [
   body('email').isEmail().withMessage('Email Invalide'),
   body('lastname').notEmpty().withMessage('Le nom est requis')
   .isLength({min: 3, max: 50}).withMessage('Le nom doit contenir entre 3 et 50 caractères')
   .matches(/^[a-zA-Z\s-]+$/).withMessage('Le nom ne doit contenir que des lettres, des espaces et des tirets'),
   body('firstname').notEmpty().withMessage('Le prénom est requis')
   .isLength({min: 3, max: 50}).withMessage('Le prénom doit contenir entre 3 et 50 caractères')
   .matches(/^[a-zA-Z\s-]+$/).withMessage('Le prénom ne doit contenir que des lettres, des espaces et des tirets'),
   body('password').
   isLength({min: 8}).withMessage('Doit contenir au moins 8 caractères')
   .matches(/\d/).withMessage('Ddoit contenir au moins un chiffre')
   .matches(/[!@#$%^&*(),.?":{}|<>_-]/).withMessage('Doit contenir au moins un caractère spécial ( !@#$%^&*(),.?":{}|<>_- )')
   .matches(/[A-Z]/).withMessage('Doit contenir au moins une lettre majuscule')
   .matches(/[a-z]/).withMessage('Doit contenir au moins une lettre minuscule'),
   body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Les mots de passe ne correspondent pas');
      }
      return true;
    }),
    validate
]

/**
 * Règles de validation pour la connexion d'un utilisateur.
 * Valide l'email et le mot de passe.
 */
export const validateLogin = [
   body('email').isEmail().withMessage('Email Invalide'),
   body('password').notEmpty().withMessage('Mot de passe requis.').bail(),
   validate
];

