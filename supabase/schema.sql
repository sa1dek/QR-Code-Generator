-- ==============================================================================
-- Dynamic NFC & QR Code Review Cards - Supabase PostgreSQL Schema
-- ==============================================================================

-- 1. Create table for cards
CREATE TABLE IF NOT EXISTS public.cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id VARCHAR(50) NOT NULL UNIQUE,
    client_name VARCHAR(255) DEFAULT NULL,
    target_url TEXT DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT false,
    scan_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create table for card scans (Analytics)
CREATE TABLE IF NOT EXISTS public.card_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id VARCHAR(50) NOT NULL REFERENCES public.cards(card_id) ON DELETE CASCADE,
    scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_agent TEXT DEFAULT NULL,
    referer TEXT DEFAULT NULL,
    ip_hash VARCHAR(64) DEFAULT NULL
);

-- 3. Indexes for fast query and lookup
CREATE INDEX IF NOT EXISTS idx_cards_card_id ON public.cards (card_id);
CREATE INDEX IF NOT EXISTS idx_cards_is_active ON public.cards (is_active);
CREATE INDEX IF NOT EXISTS idx_cards_client_name ON public.cards (client_name);
CREATE INDEX IF NOT EXISTS idx_card_scans_card_id ON public.card_scans (card_id);
CREATE INDEX IF NOT EXISTS idx_card_scans_scanned_at ON public.card_scans (scanned_at DESC);

-- 4. Automatically update 'updated_at' column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS trigger_cards_updated_at ON public.cards;
CREATE TRIGGER trigger_cards_updated_at
    BEFORE UPDATE ON public.cards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Row Level Security (RLS)
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_scans ENABLE ROW LEVEL SECURITY;

-- Allow public read of active cards for redirect resolution
CREATE POLICY "Public read for redirect" ON public.cards
    FOR SELECT
    USING (true);

-- Allow authenticated admins to do all operations on cards
CREATE POLICY "Admins full access to cards" ON public.cards
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow insert scan records (from redirect handler)
CREATE POLICY "Public insert scans" ON public.card_scans
    FOR INSERT
    WITH CHECK (true);

-- Allow admins to read analytics scans
CREATE POLICY "Admins read scans" ON public.card_scans
    FOR SELECT
    TO authenticated
    USING (true);

-- 6. Initial Seed Data
INSERT INTO public.cards (card_id, client_name, target_url, is_active, scan_count)
VALUES
    ('CARD-001', 'مطعم المدينة للمأكولات الشرقية', 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4', true, 142),
    ('CARD-002', 'مقهى الأندلس الفاخر', 'https://search.google.com/local/writereview?placeid=ChIJs_5N0_k900gR7wXgX123456', true, 89),
    ('CARD-003', 'عيادات النخبة للأسنان', 'https://search.google.com/local/writereview?placeid=ChIJde_clinic_sample_place_id', true, 45),
    ('CARD-004', NULL, NULL, false, 0),
    ('CARD-005', NULL, NULL, false, 0)
ON CONFLICT (card_id) DO NOTHING;
