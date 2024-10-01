import { Model } from "objection";
import Role from "./Role.js";

class User extends Model {
   // Définit le nom de la table dans la base de données
   static get tableName() {
      return 'users';
   }

  // Définit la structure et les contraintes du modèle User
   static get jsonSchema() {
      return {
         type: 'object',
         required: ['email', 'lastname', 'firstname', 'password'],

         properties:{
            id: { type: 'integer'},
            email: { type: 'string', format: 'email', minLength: 5, maxLength: 255 },
            lastname: { type: 'string', minLength: 3, maxLength: 50},
            firstname: { type: 'string', minLength: 3, maxLength: 50},
            password: { type: 'string', minLength: 6, maxLength: 255 },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
         }
      };
   }

   // Définit les relations avec le model Role
  static get relationMappings() {
   return {
      roles:{
         relation: Model.ManyToManyRelation,
         modelClass: Role,
         join: {
            from: 'users.id',
            through: {
               from: 'users_roles.user_id',
               to: 'users_roles.role_id'
            },
            to: 'roles.id'
         }
      }
   };
 }
}

export default User;