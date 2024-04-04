import { Module } from "@nestjs/common";
import { LedgerController } from "./ledger.controller";
import { LedgerService } from "./ledger.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Ledger } from "./schema/ledgers.schema";

@Module({
	controllers: [LedgerController],
	providers: [LedgerService],
	imports: [TypeOrmModule.forFeature([Ledger])]
})
export class LegderModule { }
