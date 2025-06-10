import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchAgentModule } from './search-agent/search-agent.module';
import { CartAgentModule } from './cart-agent/cart-agent.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SearchAgentModule,
    CartAgentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
