export interface Card {
  id: string;
  card_id: string;
  client_name: string | null;
  target_url: string | null;
  is_active: boolean;
  scan_count: number;
  created_at: string;
  updated_at: string;
}

export interface CardScan {
  id: string;
  card_id: string;
  scanned_at: string;
  user_agent: string | null;
  referer: string | null;
  ip_hash: string | null;
}

export type CardStatus = 'active' | 'unassigned' | 'inactive';

export function getCardStatus(card: Pick<Card, 'is_active' | 'target_url'>): CardStatus {
  if (card.is_active && card.target_url && card.target_url.trim().length > 0) {
    return 'active';
  }
  if (!card.target_url || card.target_url.trim().length === 0) {
    return 'unassigned';
  }
  return 'inactive';
}

export interface DashboardStats {
  totalCards: number;
  activeCards: number;
  unassignedCards: number;
  inactiveCards: number;
  totalScans: number;
  recentScans: CardScan[];
}

export interface BulkGenerateResult {
  totalCreated: number;
  totalSkipped: number;
  createdCards: Card[];
  skippedCardIds: string[];
}
