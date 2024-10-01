import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import AuthController from '../../controllers/AuthController.js';
import User from '../../models/User.js';
import bcrypt from 'bcrypt';

jest.mock('../../models/User.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('crypto');

describe('AuthController', () => {

	describe('cookieOptions', () => {
		it('should return correct options for production ', async () => {
			process.env.NODE_ENV = 'production';
			const options = AuthController.cookieOptions(36000);
			expect(options).toEqual({
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				maxAge: 36000
			})
		});

		it('should return correct options for development', () => {
			process.env.NODE_ENV = 'development';
			const options = AuthController.cookieOptions(36000);
			expect(options).toEqual({
				httpOnly: true,
				secure: false,
				sameSite: 'strict',
				maxAge: 36000
			})
		});
	});

	describe('generateCSRFToken', () => {
		it('should generate a 32-byte hex string', () => {
			const mockToken = 'abcdef1234567890';
			crypto.randomBytes.mockReturnValue(Buffer.from(mockToken, 'hex'));

			const token = AuthController.generateCSRFToken();
			expect(token).toBe(mockToken);
			expect(crypto.randomBytes).toHaveBeenCalledWith(32);
		});
	});

	describe('generateAccessToken', () => {
		it('should generate a valid access token ', () => {
			const userId = 1;
			const csrfToken = 'testCsrfToken';
			const mockToken = 'mockAccessToken';

			jwt.sign.mockReturnValue(mockToken);

			process.env.JWT_ACCESS_SECRET = 'testSecret';
			process.env.JWT_ACCESS_LIFE = '15';

			const token = AuthController.generateAccessToken(userId, csrfToken);
			expect(jwt.sign).toHaveBeenCalledWith({
					id: userId,
					csrfToken: csrfToken
				},
				'testSecret', {
					expiresIn: '15m'
				}
			);
			expect(token).toBe(mockToken);
		});
	});

	describe('generateRefreshToken', () => {
		it('should generate a refresh token with the correct expiration for remember me', () => {
			process.env.JWT_REFRESH_REMEMBER = '30';
			const userId = 1;
			const rememberMe = true;
			AuthController.generateRefreshToken(userId, rememberMe);

			expect(jwt.sign).toHaveBeenCalledWith(
				{ id: userId },
				process.env.JWT_REFRESH_SECRET,
				{expiresIn: `${process.env.JWT_REFRESH_REMEMBER}d`	 }
			)
		});

		it('should generate a refresh token with the correct expiration for normal login', () => {
			process.env.JWT_REFRESH_REMEMBER = '24';
			const userId = 1;
			const rememberMe = false;
			AuthController.generateRefreshToken(userId, rememberMe);

			expect(jwt.sign).toHaveBeenCalledWith(
				{ id: userId },
				process.env.JWT_REFRESH_SECRET,
				{ expiresIn: `${process.env.JWT_REFRESH_LIFE}h`	 }
			)
		});
	});

	describe('signup', () => {
		let req,res;

		beforeEach(() => {
			req = { 
				body: {
					email: 'John@Doe.com',
					lastname: 'Doe',
					firstname: 'John',
					password: 'Password_123',
					role: 'user'
				}
			};

			res = {
				json: jest.fn(),
				status: jest.fn().mockReturnThis(),
			};

			jest.clearAllMocks()
		});

		it('should create a new user successfully ', async () => {
			const mockUser = { id: 1, email: 'John@Doe.com', lastname: 'Doe', firstname: 'John' };
			User.query = jest.fn().mockReturnValue({
				findOne: jest.fn().mockResolvedValue(null)
			 });

			User.transaction = jest.fn().mockResolvedValue(mockUser);

			bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');
	  
			await AuthController.signup(req, res);
	  
			expect(User.transaction).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
			  user: expect.objectContaining({
				 id: 1,
				 email: 'John@Doe.com',
				 role: 'user'
			  })
			}));
		});

		it('should return 400 if user already exists ', async () => {
			User.query = jest.fn().mockReturnValue({
				findOne: jest.fn().mockResolvedValue({ id: 1, email: 'john@example.com' })
			 });
		
			 await AuthController.signup(req, res);
		
			 expect(res.status).toHaveBeenCalledWith(400);
			 expect(res.json).toHaveBeenCalledWith({
				message: 'Il existe déjà un compte associé à cette adresse e-mail.'
			 });
		});

		it('should return 400 if role is not found ', async () => {
			User.query = jest.fn().mockReturnValue({
				findOne: jest.fn().mockResolvedValue(null)
			 });

			User.transaction = jest.fn().mockImplementation(() => {
				throw new Error('Rôle non trouvé');
			 });

			bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');

			await AuthController.signup(req, res);
		
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				message: "Erreur lors de la création de l'utilisateur",
				error: 'Rôle non trouvé'
			 });
		});
	});

	describe('login', () => {
		let req, res, next;

		beforeEach(() => {
			req = { 
				body: {
					email: 'John@Doe.com',
					password: 'password123',
					rememberMe: false
				}
			};

			res = {
				json: jest.fn(),
				status: jest.fn().mockReturnThis(),
				cookie: jest.fn()
			};

			next = jest.fn();

			mockGenerateCSRFToken = jest.spyOn(AuthController, 'generateCSRFToken').mockReturnValue('mockCsrfToken');
		 	mockGenerateAccessToken = jest.spyOn(AuthController, 'generateAccessToken').mockReturnValue('mockAccessToken');
		 	mockGenerateRefreshToken = jest.spyOn(AuthController, 'generateRefreshToken').mockReturnValue('mockRefreshToken');
		});

		it('should return 401 if user not found', async () => {
			User.query = jest.fn().mockReturnValue({
				findOne: jest.fn().mockReturnValue({
					withGraphFetched: jest.fn().mockResolvedValue(null)
				})
			});

			await AuthController.login(req, res);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
				errors: expect.arrayContaining([
					expect.objectContaining({
						msg: "Email ou mot de passe incorrect."
					})
				])
			}))
		});

		it('should return 401 if wrong password', async () => {
			const mockUser = {
				id: 1,
				email: 'John@Doe.com',
				password: 'hashedCorrectPassword',
				roles: [{ name: 'user' }]
			 };

			 User.query = jest.fn().mockReturnValue({
				findOne: jest.fn().mockReturnValue({
					withGraphFetched: jest.fn().mockResolvedValue(mockUser)
				})
			});

			bcrypt.compare.mockResolvedValue(false);

			await AuthController.login(req, res);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
				errors: expect.arrayContaining([
					expect.objectContaining({
						msg: "Email ou mot de passe incorrect."
					})
				])
			}))
		});

		it('should login successfully and return user data with tokens', async () => {
			const mockUser = {
				id: 1,
				email: 'John@Doe.com',
				lastname: 'Doe',
				firstname: 'John',
				password: 'hashedCorrectPassword',
				roles: [{ name: 'user' }]
			 };

			 User.query = jest.fn().mockReturnValue({
				findOne: jest.fn().mockReturnValue({
					withGraphFetched: jest.fn().mockResolvedValue(mockUser)
				})
			});

			bcrypt.compare.mockResolvedValue(true);

			await AuthController.login(req, res);

			expect(mockGenerateCSRFToken).toHaveBeenCalled();
			expect(mockGenerateAccessToken).toHaveBeenCalledWith(mockUser.id, 'mockCsrfToken');
			expect(mockGenerateRefreshToken).toHaveBeenCalledWith(mockUser.id, false);

			expect(res.cookie).toHaveBeenCalledTimes(2);
			expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
			  message: 'Connexion réussie',
			  user: expect.objectContaining({
				 id: mockUser.id,
				 lastname: mockUser.lastname,
				 firstname: mockUser.firstname,
				 email: mockUser.email,
				 roles: ['user']
			  }),
			  isAuthenticated: true,
			  csrfToken: 'mockCsrfToken'
			}));

			jest.clearAllMocks()
			// With Remember Me

			req.body.rememberMe = true;
			await AuthController.login(req, res);
	  
			expect(mockGenerateRefreshToken).toHaveBeenCalledWith(mockUser.id, true);
			expect(res.cookie).toHaveBeenCalledTimes(2);
		});
	});

	describe('refresh', () => {
		let req, res;

		beforeEach(() => {
			req = {
				cookies: {
					refreshToken: 'valid.refresh.token'
				}
			};
			res = {
				json: jest.fn(),
				status: jest.fn().mockReturnThis(),
				cookie: jest.fn()
			};

			process.env.JWT_REFRESH_SECRET = 'refreshTestSecret';
			process.env.JWT_ACCESS_LIFE = '15';

			AuthController.generateCSRFToken = jest.fn().mockReturnValue('newCsrfToken');
			AuthController.generateAccessToken = jest.fn().mockReturnValue('new.access.token');

			jwt.verify.mockReset();
		});

		it('should refresh tokens successfully', () => {
			const mockDecodedToken = { id: 1 };
			jwt.verify.mockReturnValue(mockDecodedToken);
	
			AuthController.refresh(req, res);
	
			expect(res.cookie).toHaveBeenCalledWith(
			  'accessToken',
			  'new.access.token',
			  expect.objectContaining({
				 httpOnly: true,
				 secure: false,
				 sameSite: 'strict',
				 maxAge: 15 * 60 * 1000
			  })
			);
	
			expect(res.json).toHaveBeenCalledWith({
			  message: 'Token rafraîchi avec succès',
			  csrfToken: 'newCsrfToken'
			});
		});

		it('should return 401 if refresh token is missing', () => {
			req.cookies.refreshToken = undefined;
			 AuthController.refresh(req,res);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({ message: "Refresh token manquant"});
		});

		it('should return 401 if refresh token is invalid', () => {
			jwt.verify.mockImplementation(() => {
			  throw new Error('invalid token');
			});
	
			AuthController.refresh(req, res);
	
			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({ message: 'Refresh token invalide' });
		});
	});

	describe('me', () => {
		it('should return authenticated user information', async () => {
			const req = {
				user: {
					id: 1,
					email: 'John@Doe.com',
					lastname: 'Doe',
					firstname: 'John',
					password: 'hashedCorrectPassword',
					roles: [{ name: 'user' }]
				}
			};
			const res = {
				json: jest.fn()
			};

			await AuthController.me(req, res);

			expect(res.json).toHaveBeenCalledWith({
				isAuthenticated: true,
				user: {
					id:1,
					lastname: 'Doe',
					firstname: 'John',
					email: 'John@Doe.com',
					roles: ['user']
				}
			});
		});
	});

	describe('logout', () => {
		it('should clear cookies and return success message', async () => {
			const req = {};
			const res = {
				clearCookie: jest.fn(),
				status: jest.fn().mockReturnThis(),
				json: jest.fn()
			};

			await AuthController.logout(req, res);

			expect(res.clearCookie).toHaveBeenCalledWith('accessToken');
			expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				message: 'Déconnexion réussie',
				isAuthenticated: false,
				user: null
			});
		});
	});
});