import { faker } from "@faker-js/faker";
import { Wallet } from "../schema/wallet.schema";
import { WALLET_STATUS } from "../schema/wallet.enums";

export const GenerateTestWalletData = (overrides?: Partial<Wallet>): Wallet => {
	return {
		walletId: faker.string.uuid(),
		userId: faker.string.uuid(),
		balance: "1234.444",
		currency: "NGN",
		status: WALLET_STATUS.ACTIVE,
		timestamps: faker.date.anytime(),
		...overrides
	}
}
