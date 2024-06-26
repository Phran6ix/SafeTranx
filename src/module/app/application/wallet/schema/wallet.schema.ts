import { Column, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { CURRENCY, WALLET_STATUS } from "./wallet.enums";

@Entity("Wallet")
export class Wallet {
	@PrimaryGeneratedColumn("uuid")
	@Index()
	@Column({ type: String })
	walletId: string

	@Index()
	@PrimaryColumn()
	@Column({ type: String })
	userId: string

	@Column({ type: String, default: "0" })
	balance: string

	@Column({ type: String, default: CURRENCY.NGN })
	currency: string

	@Column({ type: String, enum: WALLET_STATUS, default: WALLET_STATUS.ACTIVE })
	status: string

	@Column({ type: Date, default: new Date() })
	timestamps: Date
}
