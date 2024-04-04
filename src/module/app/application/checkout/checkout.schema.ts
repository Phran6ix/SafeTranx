import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PaymentEvent } from "../payment/schema/paymemtEvent.schema";

@Entity("Checkout")
export class Checkout {
	@PrimaryGeneratedColumn("uuid")
	checkoutId: string

	@Column()
	userId: string

	@OneToOne(() => PaymentEvent)
	event: PaymentEvent
}
