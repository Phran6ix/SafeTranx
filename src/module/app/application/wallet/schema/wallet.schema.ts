import { Column, Entity, Index, PrimaryColumn } from "typeorm";
import { WALLET_STATUS } from "./wallet.enums";

@Entity("Wallet")
export class Wallet {
	@Index()
	@PrimaryColumn()
	@Column({ type: String })
	userId: string

	@Column({ type: String })
	amount: string

	@Column({ type: String })
	currency: string

	@Column({ type: String, enum: WALLET_STATUS })
	status: string

	@Column({ type: Date })
	timestamps: Date
}
