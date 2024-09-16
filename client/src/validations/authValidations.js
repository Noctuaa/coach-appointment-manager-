import * as yup from 'yup';

/**
 *  Schema de validation pour le formulaire de connexion.
 * * @type {import('yup').ObjectSchema}
 */
export const loginSchema = yup.object().shape({
  email: yup.string().required('Email invalide.').email('Email invalide.'),
  password: yup.string().required('Mot de passe requis.'),
});