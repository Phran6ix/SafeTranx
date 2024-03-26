import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Wallet } from "./schema/wallet.schema";
import { Repository } from "typeorm";
import { WALLET_STATUS } from "./schema/wallet.enums";

@Injectable()
export class WalletService {
	constructor(
		@InjectRepository(Wallet)
		private readonly walletRepository: Repository<Wallet>
	) { }

	async GetUserWallet(userId: string): Promise<{ wallet: Wallet }> {
		const wallet = await this.walletRepository.findOneBy({ userId })
		if (!wallet) {
			throw new NotFoundException("cannot successfully fetch wallet, please reach out to support")
		}

		if (wallet.status == WALLET_STATUS.BLOCKED) {
			throw new ForbiddenException("Your wallet has been blocked, please reach out to support")
		}

		if (wallet.status == WALLET_STATUS.SUSPENDED) {
			throw new ForbiddenException("Your wallet is currently suspended, please reach out to support")
		}

		return { wallet }
	}

	async CreateAWallet(userId: string): Promise<void> {
		const existingWallet = await this.walletRepository.findOneBy({ userId })
		if (existingWallet) {
			throw new ForbiddenException("Acount already has a wallet")
		}

		const newWallet = new Wallet()
		newWallet.userId = userId

		await this.walletRepository.save(newWallet)
		return 
	}
}
