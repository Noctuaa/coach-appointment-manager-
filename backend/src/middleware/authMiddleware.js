import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
   try {
      // Récupérer le token du cookie
      const token = req.cookies.token;
      if(!token) { return res.status(401).json({ message: "Authentification requise" })};

      // Vérifie le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

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