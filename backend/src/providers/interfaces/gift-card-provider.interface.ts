// ─── Provider Response Types ───────────────────────────────────────────────────

export enum CardStatus {
  ACTIVE = 'ACTIVE',
  USED = 'USED',
  EXPIRED = 'EXPIRED',
  INVALID = 'INVALID',
  BLOCKED = 'BLOCKED',
  UNKNOWN = 'UNKNOWN',
}

export interface VerifyCardInput {
  cardCode: string;
  pin?: string;
  cardType: string;
  currency: string;
  amount: number;
}

export interface ProviderResponse {
  valid: boolean;
  balance?: number;
  currency?: string;
  cardStatus: CardStatus;
  rawResponse: Record<string, unknown>;
  provider: string;
  verifiedAt: Date;
}

// ─── Provider Interface ────────────────────────────────────────────────────────

export interface IGiftCardProvider {
  readonly name: string;

  /**
   * Verifies a gift card and returns balance/status information.
   */
  verifyCard(input: VerifyCardInput): Promise<ProviderResponse>;

  /**
   * Checks the balance of a gift card.
   */
  checkBalance(cardCode: string, pin?: string): Promise<{ balance: number; currency: string }>;

  /**
   * Returns true if the provider API is reachable.
   */
  healthCheck(): Promise<boolean>;

  /**
   * Normalizes a raw provider response into a ProviderResponse.
   */
  normalizeResponse(raw: unknown): ProviderResponse;
}

// ─── Provider Token ────────────────────────────────────────────────────────────

export const GIFT_CARD_PROVIDER = 'GIFT_CARD_PROVIDER';
