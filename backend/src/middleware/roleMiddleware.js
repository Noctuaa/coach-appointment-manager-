/**
 * Middleware pour vérifier les rôles de l'utilisateur
 * @param {string[]} roles - Un tableau de rôles autorisés 
 * @returns
 */
const roleMiddleware = (roles) => {
   return (req, res, next) => {

      // Vérifie si l'utilisateur est authentifié
      if (!req.user) { return res.status(401).json({ message: "Authentification requise" });};


       // Vérifie si l'utilisateur a le role requis
       const userRoles = req.user.roles.map(role => role.name);
       const hasRequiredRole = roles.some(role => userRoles.includes(role));
       if (!hasRequiredRole) { return res.status(403).json({ message: "Accès non autorisé" });}
   
       next();
   }
}

export default roleMiddleware;