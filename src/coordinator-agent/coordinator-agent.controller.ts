import { Controller, Get, Query } from '@nestjs/common';
import { CoordinatorAgentService } from './coordinator-agent.service';

@Controller('invoke')
export class CoordinatorAgentController {
  constructor(
    private readonly coordinatorAgentService: CoordinatorAgentService,
  ) {}

  @Get('/')
  async invoke(@Query('query') query: string) {
    return await this.coordinatorAgentService.process({
      input: query,
      configurable: { thread_id: '42' },
    });
  }
}
