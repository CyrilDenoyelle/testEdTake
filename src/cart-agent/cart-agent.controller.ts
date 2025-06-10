import { Controller, Get, Query } from '@nestjs/common';
import { CartAgentService } from './cart-agent.service';

@Controller('cart')
export class CartAgentController {
  constructor(private readonly cartAgentService: CartAgentService) {}

  @Get('process')
  async processQuery(@Query('query') query: string): Promise<string> {
    if (!query) {
      return 'No query';
    }
    return await this.cartAgentService.process({
      input: query,
      configurable: { thread_id: '42' },
    });
  }
}
