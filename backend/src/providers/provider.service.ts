import { Injectable, Inject, Logger } from '@nestjs/common';
import {
  IGiftCardProvider,
  GIFT_CARD_PROVIDER,
  VerifyCardInput,
  ProviderResponse,
} from './interfaces/gift-card-provider.interface';

@Injectable()
export class ProviderService {
  private readonly logger = new Logger(ProviderService.name);

  constructor(
    @Inject(GIFT_CARD_PROVIDER)
    private readonly provider: IGiftCardProvider,
  ) {}

  async verifyCard(input: VerifyCardInput): Promise<ProviderResponse> {
    this.logger.log(`Delegating to provider: ${this.provider.name}`);
    return this.provider.verifyCard(input);
  }

  async healthCheck(): Promise<{ provider: string; healthy: boolean }> {
    const healthy = await this.provider.healthCheck();
    return { provider: this.provider.name, healthy };
  }

  getProviderName(): string {
    return this.provider.name;
  }
}
