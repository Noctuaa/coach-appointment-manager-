import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Role from '../models/Role.js';
import { transaction } from 'objection';

class AuthController {

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

            if (!roleRecord) {
               throw new Error('Rôle non trouvé');
             }

            //Création de l'utilisateur
            const user = await User.query(trx).insert({
               email: email,
               password: hashedPassword
            });

            // Ajout de l'entrée dans users_roles
            await user.$relatedQuery('roles', trx).relate(roleRecord.id);

            return user;
         })

         const token = jwt.sign({ id : result.id }, process.env.JWT_SECRET, { expiresIn: '1h'});

         res.status(201).json({ user: { id: result.id, email: result.email, role:role }, token });
      } catch (error) {
         res.status(400).json({ message: `Erreur lors de la création de l'utilisateur'`, error: error.message });
      }
   };

   static async login (req, res) {
      try {
         const { email, password, rememberMe } = req.body;

         // Vérifie si l'utilisateur existe
         const user = await User.query().findOne({email}).withGraphFetched('roles');
         if(!user) { return res.status(401).json({ message: "Email ou mot de passe incorrect"})};

         // Vérifie le password
         const isValidPassword = await bcrypt.compare(password, user.password);
         if(!isValidPassword) { return res.status(401).json({ message: "Email ou mot de passe incorrect"})};

         // Génére le token JWT
         const token = jwt.sign({ id: user.id, roles: user.roles.map(role => role.name)},
            process.env.JWT_SECRET,
            { expiresIn: rememberMe ? '30d' : '1d'}
         )

         // Configure le cookie
         res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 // 30 jours ou 1 jour
         })

         res.json({
            message: 'Connexion réussie',
            user: {
               id: user.id,
               email: user.email,
               rememberMe: rememberMe,
               roles: user.roles.map(role => role.name),
            }
         })

      } catch (error) {
         console.error('Erreur lors de la connexion:', error);
         res.status(500).json({ message: 'Erreur lors de la connexion' });
      }
   };
}


export default AuthController;