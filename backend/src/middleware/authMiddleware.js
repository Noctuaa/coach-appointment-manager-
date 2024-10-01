import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware pour vérifier l'authentification de l'utilisateur
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de requête Express
 * @param {function} next - Fonction pour passer au middleware suivant
 */
const authMiddleware = async (req, res, next) => {
   try {
      // Récupére les token et fait une vérification si ils existent
      const csrfToken = req.headers['x-csrf-token'] == 'null' ? false : req.headers['x-csrf-token'] ;
      const accessToken = req.cookies.accessToken;
      const refreshToken = req.cookies.refreshToken;

      if(!refreshToken) { return res.status(401).json({isAuthenticated : false, message: 'Authentification requise'})}

      if(!accessToken || !csrfToken) { return res.status(401).json({ message: "Token expiré", isAuthenticated: true, refresh: true })};


      // Vérifie le token
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

      // Vérifie si l'utilisateur existe toujours dans la base de données
      const user = await User.query().findById(decoded.id).withGraphFetched('roles');
      if(!user) { return res.status(401).json({ message: "Utilisateur non trouvé" })};

       // Ajoute l'utilisateur à l'objet request pour une utilisation ultérieure
      req.user = user;
      next();
      
   } catch (error) {
      console.error(`Erreur d'authentification:`, error);
      if (error.name === 'JsonWebTokenError') {
         return res.status(401).json({ message: "Token invalide" });
      }
      if (error.name === 'TokenExpiredError') {
         return res.status(401).json({ message: "Token expiré" });
      }
      res.status(500).json({ message: "Erreur lors de l'authentification" });
   }
}

export default authMiddleware;