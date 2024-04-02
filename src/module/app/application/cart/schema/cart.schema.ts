import { Column, Entity, ManyToMany, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/schema/user.schema";
import { Product } from "../../product/schema/product.schema";

@Entity("Cart")
export class Cart {
	@PrimaryGeneratedColumn("uuid")
	cartId: string

	@Column({ type: String })
	subTotal: string

	@Column({ type: "array" })
	discounts: string[]

	@ManyToMany(() => Product)
	products: Product[]

	@PrimaryColumn()
	@OneToOne(() => User)
	user: User
}
