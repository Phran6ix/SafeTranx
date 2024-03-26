import { BaseEntity, Column, Entity, Generated, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/schema/user.schema";

@Entity("Product")
export class Product extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	@PrimaryColumn()
	// @Generated("uuid")
	id: string

	@Column({ type: String, nullable: false })
	name: string

	@Column({ nullable: false, type: String })
	price: string

	@Column({ type: String, nullable: false })
	description: string

	@Column({ type: Date, default: new Date() })
	created_at: Date

	@ManyToOne(() => User, (user) => user.product)
	user: User

}
