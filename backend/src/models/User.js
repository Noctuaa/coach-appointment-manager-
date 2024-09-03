import { Model } from "objection";

class User extends Model {
   // Définit le nom de la table dans la base de données
   static get tableName() {
      return 'users';
   }

  // Définit la structure et les contraintes du modèle User
   static get jsonSchema() {
      return {
         type: 'object',
         required: ['email', 'password'],

         properties:{
            id: { type: 'integer'},
            email: { type: 'string', format: 'email', minLength: 5, maxLength: 255 },
            password: { type: 'string', minLength: 6, maxLength: 255 },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
         }
      };
   }

   // Définit les relations avec d'autres modèles (à implémenter plus tard)
  static get relationMappings() {
   // Sera implémenté quand nous ajouterons la relation avec les rôles
   return {};
 }
}

export default User;