import { OneToMany, Entity, BaseEntity, Column, Index, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { USER_ROLES } from "../enum/user.role";
import { Product } from "../../product/product.schema";

@Entity("User")
export class User {
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

	@Column({ default: USER_ROLES.USER })
	role: string

	@Column({ type: String, nullable: true })
	refreshToken: string

	@Column({ type: Date, default: new Date() })
	createdAt: Date

	@Column({ type: Date, nullable: true })
	lastLogin: Date

	@OneToMany(() => Product, (product) => product.user)
	product: Product[]
}
