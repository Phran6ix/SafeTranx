import { Entity, BaseEntity, Column, Index } from "typeorm";

@Entity("User")
export class User extends BaseEntity {
	@Column({ unique: true, primary: true })
	id: string;

	@Index({ unique: true })
	@Column({ unique: true })
	email: string;

	@Column()
	firstname: string;

	@Column()
	lastname: string

	@Column()
	username: string

	@Column({ default: false })
	isActive: boolean

	@Column()
	password: string

	@Column()
	isDeleted: string

	@Column({ type: String })
	refreshToken: string

	@Column({ type: Date, default: Date.now() })
	createdAt: Date

	@Column({ type: Date })
	lastLogin: Date
}
