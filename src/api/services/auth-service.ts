import { LoginSchema, RegisterSchema } from '@api/schemas/auth-schema';
import appDataSource from '@base/config/database/database-config';
import messages from '@base/constants/messages';
import { HttpException } from '@base/utils/app-error';
import { BcryptUtils } from '@base/utils/bcrypt-utils';
import { autoInjectable, singleton } from 'tsyringe';
import { Repository } from 'typeorm'; // Importing getRepository and Repository
import { User } from '../models/user-model';

@autoInjectable()
@singleton()
class AuthService {
	private userRepository: Repository<User>;

	constructor() {
		// Initialize userRepository with the repository for the User model
		this.userRepository = appDataSource.getRepository(User);
	}

	/**
	 * Retrieves a user from the database by their ID.
	 *
	 * @param {number} id - The ID of the user to retrieve.
	 * @returns {Promise<User>} - A Promise that resolves to the user object if found, or rejects with a HttpException if the user is not found.
	 */
	public async getUser(id: number): Promise<User> {
		const user = await this.userRepository.findOne({ where: { id } });
		if (!user) {
			throw HttpException.badRequest(messages['userNotFound']);
		}
		return user;
	}

	/**
	 * Retrieves a user from the database by their email address.
	 *
	 * @param {string} email - The email address of the user to retrieve.
	 * @returns {Promise<User>} - A Promise that resolves to the user object if found, or rejects with a HttpException if the user is not found.
	 */
	public async getEmail(email: string): Promise<User> {
		const user = await this.userRepository.findOne({ where: { email } });
		return user;
	}

	/**
	 * Registers a new user in the database.
	 *
	 * @param {RegisterSchema} body - The registration data for the new user.
	 * @returns {Promise<User>} - A Promise that resolves to the newly created user object if successful, or rejects with an error if the email is already taken.
	 */
	public async register(body: RegisterSchema): Promise<User> {
		const doesEmailExists = await this.getEmail(body.email);
		if (doesEmailExists) {
			throw HttpException.badRequest(messages['emailAlreadyExists']);
		}
		body.password = await BcryptUtils.hash(body.password);
		const newUser = this.userRepository.create(body);
		await this.userRepository.save(newUser);
		return newUser;
	}
	/**
	 * Logs in a user by checking their email and password against the database.
	 *
	 * @param {LoginSchema} body - The login data for the user.
	 * @returns {Promise<User>} - A Promise that resolves to the user object if the login is successful, or rejects with a HttpException if the user is not found.
	 */

	public async login(body: LoginSchema): Promise<User> {
		const user = await this.userRepository.findOne({ where: { email: body.email } });
		if (!user) {
			throw HttpException.badRequest(messages['userNotFound']);
		}

		const isValidpassword = await BcryptUtils.compare(body.password, user.password);
		console.log(isValidpassword, body, 'amzing');

		if (!isValidpassword) {
			throw HttpException.badRequest(messages['invalidPassword']);
		}

		return user;
	}
}

export default AuthService;
