import { Injectable, Logger } from '@nestjs/common';
import {
  IGiftCardProvider,
  VerifyCardInput,
  ProviderResponse,
  CardStatus,
} from '../interfaces/gift-card-provider.interface';

/**
 * MockProvider — simulates a real gift card verification provider.
 * Used for development, testing, and demonstration.
 *
 * To add a real provider:
 * 1. Create a new class implementing IGiftCardProvider
 * 2. Register it in providers.module.ts
 * 3. Update ACTIVE_PROVIDER setting in the DB
 */
@Injectable()
export class MockProvider implements IGiftCardProvider {
  readonly name = 'mock';
  private readonly logger = new Logger(MockProvider.name);

  async verifyCard(input: VerifyCardInput): Promise<ProviderResponse> {
    this.logger.log(`[MockProvider] Verifying card type=${input.cardType}`);

    // Simulate network delay
    await this.simulateDelay(800, 2000);

    const raw = this.simulateProviderResponse(input);
    return this.normalizeResponse(raw);
  }

  async checkBalance(
    cardCode: string,
    _pin?: string,
  ): Promise<{ balance: number; currency: string }> {
    await this.simulateDelay(500, 1000);
    return {
      balance: Math.round(Math.random() * 20000) / 100, // 0 - 200.00
      currency: 'USD',
    };
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }

  normalizeResponse(raw: Record<string, unknown>): ProviderResponse {
    return {
      valid: raw.valid as boolean,
      balance: raw.balance as number | undefined,
      currency: (raw.currency as string) || 'USD',
      cardStatus: (raw.card_status as CardStatus) || CardStatus.UNKNOWN,
      rawResponse: raw,
      provider: this.name,
      verifiedAt: new Date(),
    };
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private simulateProviderResponse(input: VerifyCardInput): Record<string, unknown> {
    // Deterministic simulation based on card code last char
    const lastChar = input.cardCode.slice(-1).toUpperCase();
    const charCode = lastChar.charCodeAt(0);

    if (charCode % 10 === 0) {
      // 10% chance: invalid card
      return { valid: false, card_status: CardStatus.INVALID, balance: 0, currency: input.currency };
    } else if (charCode % 7 === 0) {
      // ~14% chance: used card
      return { valid: false, card_status: CardStatus.USED, balance: 0, currency: input.currency };
    } else if (charCode % 11 === 0) {
      // ~9% chance: expired card
      return { valid: false, card_status: CardStatus.EXPIRED, balance: 0, currency: input.currency };
    } else {
      // ~67% chance: valid card with remaining balance
      const balance = Math.min(
        input.amount,
        Math.round(((charCode % 100) / 100) * input.amount * 100) / 100,
      );
      return {
        valid: true,
        card_status: CardStatus.ACTIVE,
        balance,
        currency: input.currency,
        original_amount: input.amount,
      };
    }
  }

  private simulateDelay(min: number, max: number): Promise<void> {
    const ms = min + Math.random() * (max - min);
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
