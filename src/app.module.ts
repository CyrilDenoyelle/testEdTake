import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartAgentModule } from './cart-agent/cart-agent.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CartAgentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
