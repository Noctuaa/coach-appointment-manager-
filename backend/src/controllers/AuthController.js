import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

class AuthController {

   static async signup (req, res) {
      try {
         const { email, password } = req.body;

         console.log(email, password)

         // Vérifier si l'utilisateur existe déjà
         const emailIsExist = await User.query().findOne({ email });
         if(emailIsExist) { return res.status(400).json({ message: 'Il existe déjà un compte associé à cette adresse e-mail.'})};

         const hashedPassword = await bcrypt.hash(password, 10);

         const user = await User.query().insert({
            email: email,
            password: hashedPassword
         });

         const token = jwt.sign({ id : user.id }, process.env.JWT_SECRET, { expiresIn: '1h'});

         res.status(201).json({ user: { id: user.id, email: user.email }, token });
      } catch (error) {
         res.status(400).json({ message: `Erreur lors de la création de l'utilisateur'`, error: error.message });
      }
   }
}


export default AuthController;