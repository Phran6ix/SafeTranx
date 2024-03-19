import { Optional } from "@nestjs/common";
import { Entity, BaseEntity, Column, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("User")
export class User extends BaseEntity {
	@Column({ unique: true, primary: true })
	@PrimaryGeneratedColumn()
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

	@Column({ default: false })
	isDeleted: boolean

	@Column({ type: String, nullable: true })
	refreshToken: string

	@Column({ type: Date, default: new Date() })
	createdAt: Date

	@Column({ type: Date ,nullable: true})
	lastLogin: Date
}
