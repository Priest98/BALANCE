import { Module } from '@nestjs/common';
import { MockProvider } from './mock/mock.provider';
import { ProviderService } from './provider.service';
import { GIFT_CARD_PROVIDER } from './interfaces/gift-card-provider.interface';

@Module({
  providers: [
    MockProvider,
    // Register all concrete providers here:
    // RealProvider,
    {
      provide: GIFT_CARD_PROVIDER,
      useClass: MockProvider,
      // To switch providers: useClass: RealProvider
    },
    ProviderService,
  ],
  exports: [ProviderService, GIFT_CARD_PROVIDER],
})
export class ProvidersModule {}
