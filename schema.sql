-- Enable the pgvector extension
create extension if not exists vector;

-- Create the agent_memory table for semantic search
create table agent_memory (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  memory_type text not null, -- e.g., 'cast', 'user_relationship', 'topic_vibe'
  content text not null,     -- The raw text content
  embedding vector(1536),    -- Assuming OpenAI embeddings (1536 dims)
  metadata jsonb default '{}'::jsonb -- Additional context (FID, cast hash, etc)
);

-- Index for faster semantic similarity search
-- CREATE INDEX on agent_memory USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Ledger for enforcing strict local financial constraints
create table tip_ledger (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  recipient_fid text not null,
  amount numeric not null,
  token text not null,
  tx_hash text
);
