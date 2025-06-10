import { Module } from '@nestjs/common';
import { CartFunctionsService } from './cart-functions.service';
import { CartAgentController } from './cart-agent.controller';
import { CartAgentService } from './cart-agent.service';
import { AgentModule } from '../agent/agent.module';

@Module({
  imports: [AgentModule],
  controllers: [CartAgentController],
  providers: [CartFunctionsService, CartAgentService],
  exports: [CartFunctionsService, CartAgentService],
})
export class CartAgentModule {}
