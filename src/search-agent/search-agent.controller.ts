import { Controller, Get, Query } from '@nestjs/common';
import { SearchAgentService } from './search-agent.service';

@Controller('search')
export class SearchAgentController {
  constructor(private readonly searchAgentService: SearchAgentService) {}

  @Get('process')
  async processQuery(@Query('query') query: string): Promise<string> {
    if (!query) {
      return 'No query';
    }
    return await this.searchAgentService.process({
      input: query,
      configurable: { thread_id: '42' },
    });
  }
}
