import { faker } from '@faker-js/faker'
import { CreateUserDto } from '../../user/dto/createUser.dto'
import { USER_ROLES } from '../../user/enum/user.role'
import { User } from '../../user/schema/user.schema'

export const GenerateUserDTO = (): CreateUserDto => {
	return {
		firstname: faker.person.firstName(),
		lastname: faker.person.lastName(),
		email: faker.internet.email(),
		username: faker.person.middleName(),
		role: USER_ROLES.USER,
		password: faker.internet.password()
	}
}

export const GenerateUser = (overrides?: Partial<User>): User => {
	return {
		firstname: faker.person.firstName(),
		lastname: faker.person.lastName(),
		username: faker.person.middleName(),
		email: faker.internet.email(),
		isActive: false,
		lastLogin: null,
		id: '1',
		isDeleted: false,
		role: USER_ROLES.USER,
		password: faker.internet.password(),
		refreshToken: null,
		createdAt: new Date(),
		product: [],
		...overrides
	}
}
