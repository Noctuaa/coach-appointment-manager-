import { Model } from "objection";
import User from "./User.js";


class Role extends Model {
   // Définit le nom de la table dans la base de données
   static get tableName() {
      return 'roles';
   }

  // Définit la structure et les contraintes du modèle User
   static get jsonSchema() {
      return {
         type: 'object',
         required: ['name'],
         properties:{
            id: { type: 'integer'},
            name: { type: 'string', minLength: 3, maxLength: 255 },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
         }
      };
   }

   // Définit les relations avec le model Role
   static get relationMappings() {
      return {
         users:{
            relation: Model.ManyToManyRelation,
            modelClass: User,
            join: {
               from: 'roles.id',
               through: {
                  from: 'users_roles.role_id',
                  to: 'users_roles.user_id'
               },
               to: 'users.id'
            }
         }
      };
    }
}

export default Role;