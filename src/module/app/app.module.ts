import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from '../../configs/typeorm';
import configuration from '../../configs/configuration';
import { AuthModule } from './application/authentication/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import WalletModule from './application/wallet/wallet.module';
import { CartModule } from './application/cart/cart.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    TypeOrmModule.forRoot(typeormConfig),
    AuthModule,
    WalletModule,
    CartModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
