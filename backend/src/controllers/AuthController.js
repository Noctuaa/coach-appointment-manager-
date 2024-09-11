import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Role from '../models/Role.js';
import crypto from 'crypto';
import { transaction } from 'objection';

class AuthController {

	/**
	 * Options de cookie par défaut, évite les répétitions inutiles
	 * @param {Number} maxAge Durée du cookie
	 * @returns {Object} options du cookie
	 */
	static cookieOptions(maxAge = Number){
		const options = {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: maxAge
		}
		return options;
	}

   /**
    * Génère un token CSRF aléatoire.
    * @returns {String} Token CSRF généré.
    */
   static generateCSRFToken() {
      return crypto.randomBytes(32).toString('hex');
   }

   /**
    * Génère un access token JWT pour un utilisateur.
    * @param {Number} userId - ID de l'utilisateur.
    * @param {String} csrfToken - Token CSRF à inclure dans le JWT.
    * @returns {String} Access token JWT généré.
    */
   static generateAccessToken(userId = Number, csrfToken = String) {
		const expireIn = `${process.env.JWT_ACCESS_LIFE}m`
      return jwt.sign({ id: userId, csrfToken:csrfToken }, process.env.JWT_ACCESS_SECRET, { expiresIn: expireIn });
   }

	/**
	 * Génère un refresh token JWT pour un utilisateur.
	 * @param {Number} userId - ID de l'utilisateur.
	 * @param {Boolean} rememberMe - Se souvenir de moi
	 * @returns {String} Refresh token JWT généré. 
	 */
   static generateRefreshToken(userId = Number, rememberMe = Boolean) {
		const expireIn = rememberMe ? `${process.env.JWT_REFRESH_REMEMBER}d` : `${process.env.JWT_REFRESH_LIFE}h`
      return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: expireIn });
   }

   /**
    * Gère l'inscription d'un nouvel utilisateur
    * @param {Object} req - Objet de requête Express
    * @param {Object} res - Objet de réponse Express 
    * @returns {Object} Réponse JSON avec les détails de l'utilisateur créé et le token.
    */
   static async signup (req, res) {
      try {
         const { email, password, role = 'user' } = req.body;

         // Vérifier si l'utilisateur existe déjà
         const emailIsExist = await User.query().findOne({ email });
         if(emailIsExist) { return res.status(400).json({ message: 'Il existe déjà un compte associé à cette adresse e-mail.'})};

         const hashedPassword = await bcrypt.hash(password, 10);

         // Utilisation d'une transaction pour garantir l'intégrité des données
         const result = await User.transaction (async trx => {
            
            // Récupération de l'ID du rôle
            const roleRecord = await Role.query(trx).findOne({ name: role });
            if (!roleRecord) { throw new Error('Rôle non trouvé');};

            //Création de l'utilisateur
            const user = await User.query(trx).insert({
               email: email,
               password: hashedPassword
            });

            // Ajout de l'entrée dans users_roles
            await user.$relatedQuery('roles', trx).relate(roleRecord.id);

            return user;
         })

         res.status(201).json({ user: { id: result.id, email: result.email, role:role }});
      } catch (error) {
         res.status(400).json({ message: `Erreur lors de la création de l'utilisateur'`, error: error.message });
      }
   };

   /**
    * * Gère la connexion d'un utilisateur
    * @param {Object} req - Objet de requête Express
    * @param {Object} res - Objet de réponse Express
    * @returns Réponse JSON avec le message de succès, les détails de l'utilisateur et le token CSRF.
    */
   static async login (req, res) {
      try {
         const { email, password, rememberMe } = req.body;

         // Vérifie si l'utilisateur existe et si le paswword ext correct
         const user = await User.query().findOne({email}).withGraphFetched('roles');
         const isValidPassword = await bcrypt.compare(password, user.password);
         if(!user || !isValidPassword) { return res.status(401).json({ message: "Email ou mot de passe incorrect"})};

         // Génére les tokens
         const csrfToken = AuthController.generateCSRFToken();
         const accessToken = AuthController.generateAccessToken(user.id,csrfToken); 
         const refreshToken = AuthController.generateRefreshToken(user.id, rememberMe);
			
         // Envoyer les tokens dans des cookies
			res.cookie('accessToken', accessToken, AuthController.cookieOptions(process.env.JWT_ACCESS_LIFE * 60 * 1000));
			res.cookie('refreshToken', refreshToken, AuthController.cookieOptions(
				rememberMe ? process.env.JWT_REFRESH_REMEMBER * 24 * 60 * 60 * 1000 : process.env.JWT_REFRESH_LIFE * 60 * 60 * 1000
			));

         res.json({
            message: 'Connexion réussie',
            user: {
               id: user.id,
               email: user.email,
               roles: user.roles.map(role => role.name),
            },
				isAuthenticated: true,
            csrfToken: csrfToken
         })

      } catch (error) {
         console.error('Erreur lors de la connexion:', error);
         res.status(500).json({ message: 'Erreur lors de la connexion' });
      }
   };

   /**
    * Rafraîchit le token d'accès de l'utilisateur.
    * @param {Object} req - Objet de requête Express
    * @param {Object} res - Objet de réponse Express
    * @returns {Object} Réponse JSON avec le message de succès et le nouveau token CSRF.
    */
   static async refresh(req, res) {
      const refreshToken = req.cookies.refreshToken;
    
      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token manquant' });
      }
    
      try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const newCsrfToken = AuthController.generateCSRFToken();
        const newAccessToken = AuthController.generateAccessToken(decoded.id, newCsrfToken);

    
        res.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: process.env.JWT_ACCESS_LIFE * 60 * 1000
        });
    
        res.json({ message: 'Token rafraîchi avec succès', csrfToken: newCsrfToken });
      } catch (error) {
        console.error('Erreur lors du rafraîchissement du token:', error);
        res.status(401).json({ message: 'Refresh token invalide' });
      }
    }

    /**
     * * Renvoie les informations de l'utilisateur actuellement authentifié.
    * @param {Object} req - Objet de requête Express
    * @param {Object} res - Objet de réponse Express
    * @returns {Object} Réponse JSON avec l'état d'authentification et les informations de l'utilisateur.
      */
    static async me(req, res) {
      // L'utilisateur est déjà vérifié par le middleware, donc req.user existe
      res.json({ isAuthenticated: true, user: { id: req.user.id, email: req.user.email}});
    }
    
   /**
    * Gère la déconnexion d'un utilisateur
    * @param {Object} req - Objet de requête Express
    * @param {Object} res - Objet de réponse Express
	 * @returns {Object} Réponse JSON confirmant la déconnexion.
    */
   static async logout(req,res) {
      try {
         // Efface les cookies
         res.clearCookie('accessToken');
         res.clearCookie('refreshToken');
         res.status(200).json({message: 'Déconnexion réussie', isAuthenticated: false, user: null });
      } catch (error) {
         console.error('Erreur lors de la déconnexion:', error);
         res.status(500).json({ message: 'Erreur lors de la déconnexion' });
      }
   }
}


export default AuthController;