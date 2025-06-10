import { Module } from '@nestjs/common';
import { SearchAgentService } from './search-agent.service';
import { AgentModule } from 'src/agent/agent.module';
import { SearchAgentController } from './search-agent.controller';

@Module({
  imports: [AgentModule],
  controllers: [SearchAgentController],
  providers: [SearchAgentService],
  exports: [SearchAgentService],
})
export class SearchAgentModule {}
