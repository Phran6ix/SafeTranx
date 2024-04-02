import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException, ParseFilePipe } from "@nestjs/common";

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
		console.log("in here")
		const wallet = await this.walletRepository.findOneBy({ userId })
		if (!wallet) {
			console.log("mpi")
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

	async DebitWalletBalance(data: { userId: string, amount: string, currency: string, description: string }): Promise<void> {
		const wallet = await this.walletRepository.findOneBy({ userId: data.userId, currency: data.currency })
		if (!wallet) {
			throw new NotFoundException("Wallet not found")
		}

		if (wallet.status != WALLET_STATUS.ACTIVE) {
			throw new ForbiddenException("Wallet is not active")
		}

		if (+wallet.balance <= +data.amount) {
			throw new HttpException("Insufficient balance", HttpStatus.BAD_REQUEST)
		}
		
		let newBalance = parseFloat(wallet.balance) - parseFloat(data.amount)
		await this.walletRepository.update({ walletId: wallet.walletId }, { balance: "" + newBalance })
		// wallet.balance = '' + newBalance
		// await this.walletRepository.save(wallet)

		//TODO : Create a entry in the ledger
		return
	}

	async CreditWalletBalance(data: { userId: string, amount: string, currency: string, description: string }): Promise<void> {
		const wallet = await this.walletRepository.findOneBy({ userId: data.userId, currency: data.currency })
		if (!wallet) {
			throw new NotFoundException("Wallet not found")
		}
		if (wallet.status != WALLET_STATUS.ACTIVE) {
			throw new ForbiddenException("Wallet is not active")
		}
		const newBalance = parseFloat(wallet.balance) + parseFloat(data.amount)
		await this.walletRepository.update({ walletId: wallet.walletId }, { balance: ("" + newBalance) })

		//TODO : Create a new Entry in the ledger
		return
	}
}
