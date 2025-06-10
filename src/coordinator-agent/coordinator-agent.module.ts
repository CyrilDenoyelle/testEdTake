import { Module } from '@nestjs/common';
import { CoordinatorAgentService } from './coordinator-agent.service';
import { AgentModule } from 'src/agent/agent.module';
import { SearchAgentModule } from 'src/search-agent/search-agent.module';
import { CartAgentModule } from 'src/cart-agent/cart-agent.module';
import { CoordinatorAgentController } from './coordinator-agent.controller';

@Module({
  imports: [AgentModule, SearchAgentModule, CartAgentModule],
  controllers: [CoordinatorAgentController],
  providers: [CoordinatorAgentService],
})
export class CoordinatorAgentModule {}
