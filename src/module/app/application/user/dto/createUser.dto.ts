
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { USER_ROLES } from '../enum/user.role';

export class CreateUserDto {
	@IsEmail()
	email: string;

	@IsNotEmpty()
	password: string;

	@IsNotEmpty()
	firstname: string;

	@IsNotEmpty()
	lastname: string;

	@IsNotEmpty()
	username: string;

	@IsEnum(USER_ROLES)
	role: string
}
