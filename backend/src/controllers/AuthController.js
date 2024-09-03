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
   }
}


export default AuthController;