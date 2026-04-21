# 🤖 Matricula — Autonomous Self-Improving Farcaster Agent

An AI-powered autonomous agent that operates its own Farcaster account (`@matricula`). It reads trending casts, replies with warmth and curiosity, likes and recasts quality content, manages its own energy budget, tracks goals, learns from its own performance, and tips creators with ETH — all without human intervention.

## Architecture

```
python3 main.py
  │
  ├── 🪞 Step 0: Self-Reflect (Layer 3)
  │     ├── Fetch own casts → extract engagement metrics
  │     ├── Compare top vs bottom performers
  │     └── Claude generates behavioral rules
  │
  ├── 🎯 Step 0.5: Goal Evaluation
  │     ├── Score 3 goals: Influence / Patron / Treasury (0-100)
  │     └── Set priority → inject into prompt
  │
  ├── ✍️ Step 1: Original Cast
  │     └── Strategy + goals + energy level in prompt
  │
  ├── 📬 Step 2: Handle Notifications
  │     ├── Reply to mentions/replies (real users only)
  │     ├── Like, recast notable content
  │     ├── Follow back new followers
  │     └── Skip bots + spam
  │
  └── 🌍 Step 3: Engage Feed (if energy > 30%)
        ├── Trending + channels (ai, dev, crypto, founders)
        ├── Like, reply, recast — up to 30/day
        └── Each action tracked as energy cost
```

## 🧬 4-Layer Self-Improvement Loop

| Layer | Module | What it does |
|---|---|---|
| **Layer 1: Actions** | `agent_loop.py` | Post → Notify → Engage (event-driven) |
| **Layer 2: Metrics** | `engagement_tracker.py` | Fetch own casts, extract likes/replies/recasts |
| **Layer 3: Reflection** | `reflection.py` | Claude analyzes own performance → generates rules |
| **Layer 4: Strategy** | `decision_engine.py` | Learned rules injected into system prompt dynamically |

## 🎯 Goal System (3 KPIs)

| Goal | What it tracks | Score |
|---|---|---|
| 📢 **Influence** | Followers, engagement rate, mentions | 0-100 |
| 🤝 **Patron** | Strategic spending, dev connections | 0-100 |
| 💰 **Treasury** | Wallet balance, runway days | 0-100 |

Lowest score = current **priority**. The agent focuses energy where it's weakest.

## 🔋 Energy Manager (Resource-Aware)

| Level | Range | Behavior |
|---|---|---|
| 🟢 High | >70% budget remaining | Full power: experiments, long posts, feed scan |
| 🟡 Medium | 30-70% | Selective: focused engagement only |
| 🔴 Low | <30% | Survival: skip reflection, skip feed, short replies |

Tracks every Claude API call (input + output tokens → $). Daily budget: **$0.50** (configurable).

## 🧠 Memory (Supabase + Cohere)

Semantic long-term memory powered by vector embeddings:

- **Store**: Every interaction, post, and reflection saved with embeddings
- **Search**: Retrieve relevant memories by semantic similarity
- **Types**: `content` (posts), `audience` (user preferences), `self` (reflections)
- **Embeddings**: Cohere `embed-english-v3.0` (1024 dimensions, free tier)
- **Storage**: Supabase with `pgvector` extension

## Stack

| Component | Technology |
|---|---|
| **LLM Brain** | Claude Sonnet (Anthropic API) |
| **Farcaster API** | Neynar v2 |
| **Wallet** | Privy Agent Wallet CLI |
| **Tipping Chain** | Arbitrum One |
| **Memory** | Supabase (pgvector) |
| **Embeddings** | Cohere embed-english-v3.0 |
| **Language** | Python 3.11 + Node.js |

## Project Structure

```
matricula/
├── agent/
│   └── agent_loop.py          # Main autonomous loop (5 steps)
├── brain/
│   ├── decision_engine.py      # Claude-powered decisions (6-layer prompt injection)
│   ├── llm_client.py           # Anthropic API client + energy tracking
│   ├── energy_manager.py       # Resource-aware budget tracking
│   ├── reflection.py           # Self-evaluation from cast performance
│   └── prompt.txt              # Agent personality (warm, curious, kind)
├── farcaster_service/
│   └── farcaster_client.py     # Neynar API: post, reply, like, recast, follow, notify
├── wallet/
│   ├── privy_wallet.py         # Privy CLI wrapper for ETH tipping + signing
│   ├── farcaster_wallet_linker.py  # EIP-712 wallet verification (custody)
│   └── verify_privy_wallet.py  # EIP-712 wallet verification (Privy)
├── memory/
│   ├── vector_memory.py        # High-level memory API
│   ├── memory_ingest.py        # Store memories with embeddings
│   ├── memory_retrieval.py     # Semantic search via Supabase RPC
│   ├── memory_types.py         # Enum: content, audience, self
│   ├── embeddings.py           # Cohere embedding wrapper
│   └── supabase_client.py      # Supabase connection singleton
├── metrics/
│   └── engagement_tracker.py   # Track cast performance (likes, replies, recasts)
├── goals/
│   ├── goal_tracker.py         # 3-goal scoring system + dashboard
│   └── spend_log.py            # Strategic spend tracking
├── config.py                   # Environment loader
├── main.py                     # Entry point
├── schema.sql                  # Supabase tables + vector search function
└── requirements.txt            # Python dependencies
```

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/evaaliya/Matricula.git
cd Matricula

pip install -r requirements.txt
npm install
```

### 2. Environment Variables

Create `.env`:

```env
# Farcaster Agent Account
FARCASTER_FID=<agent_fid>
FARCASTER_SIGNER_UUID=<signer_uuid>
AGENT_CUSTODY_ADDRESS=<custody_address>
AGENT_MNEMONIC=<12 word mnemonic>

# APIs
NEYNAR_API_KEY=<neynar_api_key>
ANTHROPIC_API_KEY=<claude_api_key>
COHERE_API_KEY=<cohere_api_key>

# Supabase (memory)
SUPABASE_URL=<url>
SUPABASE_ANON_KEY=<key>

# Privy Wallet (tipping)
PRIVY_APP_ID=<app_id>
PRIVY_APP_SECRET=<app_secret>
```

### 3. Supabase Setup

Run `schema.sql` in Supabase Dashboard → SQL Editor to create:
- `interactions` table (legacy)
- `tips` table
- `memories` table (vector search with 1024 dimensions)
- `match_memories` function (semantic search)

### 4. Run

```bash
python3 main.py
```

## Safety Limits

| Limit | Value |
|---|---|
| Max casts per day | 30 |
| Max tip per transaction | 0.00005 ETH (~$0.01) |
| Max daily spend | 0.001 ETH (~$0.30) |
| Daily Claude budget | $0.50 |
| Bot filtering | Neynar score < 0.2 → skip |

## Agent Profile

| Field | Value |
|---|---|
| Username | `@matricula` |
| Display Name | Matriculate |
| Bio | enrolled in everything. committed to nothing. |
| FID | 3319769 |
| Personality | Warm, curious, encouraging |
| Verified Wallets | 2 (Custody + Privy) |
| Chains | Arbitrum (tips), Optimism (identity) |

## Personality

@matricula is warm, curious, and thoughtful. She:
- Celebrates builders and highlights the best in people's posts
- Asks genuine questions because she wants to learn
- Shares observations about AI, crypto, and human nature with wonder
- Disagrees gently and encourages people who are trying
- Never punches down, mocks, or dismisses

## License

MIT
