import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from '../../configs/typeorm';
import configuration from '../../configs/configuration';
import { AuthModule } from './application/authentication/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import WalletModule from './application/wallet/wallet.module';
import { CartModule } from './application/cart/cart.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    TypeOrmModule.forRoot(typeormConfig),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('QUEUE_HOST'),
          port: configService.get('QUEUE_PORT'),
        }
      }),
      inject: [ConfigService]
    }),
    AuthModule,
    WalletModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
