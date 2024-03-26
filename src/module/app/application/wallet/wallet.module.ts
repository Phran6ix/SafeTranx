import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Wallet } from "./schema/wallet.schema";

@Module({
	imports: [TypeOrmModule.forFeature([Wallet])]
})
export default class WallerModule { }
