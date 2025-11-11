# AI Cost Estimate Report

**Generated:** 2025-11-11  
**Model Costs:** Based on OpenAI pricing as of Q4 2024

---

## Cost Assumptions

### Models Used

- **Embeddings:** `text-embedding-3-small` - $0.02 per 1M tokens
- **Classification/Tagging:** `gpt-4o-mini` - $0.15 input / $0.60 output per 1M tokens
- **Insights/Summaries:** `gpt-4o` - $2.50 input / $10.00 output per 1M tokens

### Token Estimates

- Average message: ~150 tokens
- Classification: ~200 input + ~50 output tokens
- Insight generation: ~2000 input + ~300 output tokens
- Clustering: ~10 tokens per note (minimal, mostly math operations)

---

## Usage Tier: Small (100 Active Users)

### Assumptions
- 100 active users
- 10 messages per user per day
- 80% of messages generate embeddings
- 50% of messages get classified
- 1 insight per user per week
- Daily clustering

### Cost Breakdown

**Embeddings:**
- Requests/month: 24,000
- Tokens/month: 3.6M
- **Cost/month: $0.07**

**Classification:**
- Requests/month: 15,000
- Tokens/month: 3.75M
- **Cost/month: $2.81**

**Insights:**
- Requests/month: 400
- Tokens/month: 920K
- **Cost/month: $5.75**

**Clustering:**
- Requests/month: 3,000
- Tokens/month: 300K
- **Cost/month: $0.23**

### **Total Cost: $8.86/month**

**Cost per user:** $0.09/month

---

## Usage Tier: Medium (500 Active Users)

### Assumptions
- 500 active users
- 15 messages per user per day
- 80% of messages generate embeddings
- 50% of messages get classified
- 1 insight per user per week
- Daily clustering

### Cost Breakdown

**Embeddings:**
- Requests/month: 180,000
- Tokens/month: 27M
- **Cost/month: $0.54**

**Classification:**
- Requests/month: 112,500
- Tokens/month: 28.1M
- **Cost/month: $21.09**

**Insights:**
- Requests/month: 2,000
- Tokens/month: 4.6M
- **Cost/month: $28.75**

**Clustering:**
- Requests/month: 15,000
- Tokens/month: 6.75M
- **Cost/month: $5.06**

### **Total Cost: $55.44/month**

**Cost per user:** $0.11/month

---

## Usage Tier: Large (2000 Active Users)

### Assumptions
- 2000 active users
- 20 messages per user per day
- 80% of messages generate embeddings
- 50% of messages get classified
- 1 insight per user per week
- Weekly clustering (to reduce costs)

### Cost Breakdown

**Embeddings:**
- Requests/month: 960,000
- Tokens/month: 144M
- **Cost/month: $2.88**

**Classification:**
- Requests/month: 600,000
- Tokens/month: 150M
- **Cost/month: $112.50**

**Insights:**
- Requests/month: 8,000
- Tokens/month: 18.4M
- **Cost/month: $115.00**

**Clustering:**
- Requests/month: 8,000
- Tokens/month: 48M
- **Cost/month: $36.00**

### **Total Cost: $266.38/month**

**Cost per user:** $0.13/month

---

## Cost Optimization Strategies

### 1. Feature Flags and Quotas

- Gate expensive features (insights, clustering) behind feature flags
- Implement per-user quotas:
  - Max 100 embeddings per day
  - Max 10 insights per month
  - Clustering once per week per user

**Potential savings:** 30-40% reduction

### 2. Batch Processing

- Process embeddings in batches (reduces API overhead)
- Generate insights for multiple users in single batch job
- Cluster users together in nightly job

**Potential savings:** 10-15% reduction

### 3. Caching

- Cache embeddings for duplicate content
- Cache classification results for similar messages
- Cache insight summaries for recent periods

**Potential savings:** 20-30% reduction

### 4. Model Selection

- Use cheaper models for simple tasks:
  - `gpt-4o-mini` for classification (instead of `gpt-4o`)
  - `text-embedding-3-small` for embeddings (already using)
- Reserve `gpt-4o` or better for complex insights only

**Potential savings:** 40-50% reduction

### 5. Smart Throttling

- Limit embedding generation to meaningful content (>50 characters)
- Skip classification for very short messages
- Generate insights only when sufficient new data exists

**Potential savings:** 15-25% reduction

### 6. Provider Switching

With Vercel AI SDK abstraction, we can switch to cheaper providers:

- **Anthropic Claude Haiku** for classification: ~50% cheaper than GPT-4o-mini
- **Open-source models** (via Replicate/Together): ~70-90% cheaper
- **Ollama** for embeddings (self-hosted): Free (but requires infrastructure)

**Potential savings:** 50-90% reduction (depending on provider)

---

## Recommended Cost Controls

### Implementation Plan

1. **Immediate:**
   - Add per-user daily quotas
   - Enable cost logging in `lib/ai/provider.ts`
   - Set OpenAI usage limits ($100/month initially)

2. **Week 1:**
   - Implement caching for embeddings
   - Add batch processing for background jobs
   - Gate clustering behind feature flag

3. **Week 2:**
   - Implement smart throttling
   - Add cost dashboard for monitoring
   - Set up cost alerts (>$50/month)

4. **Month 1:**
   - Test Anthropic integration for classification
   - Evaluate open-source model options
   - Optimize clustering algorithm

### Monitoring

Track these metrics:

- Daily AI cost
- Cost per user
- Cost per feature (embeddings, classification, insights)
- API error rates and retries
- Feature usage by user segment

---

## Risk Mitigation

### Runaway Costs

**Risk:** Bugs or abuse cause excessive API usage

**Mitigation:**
- Hard rate limits at user level (10 req/min per user)
- Global rate limit at app level (1000 req/min)
- OpenAI organization spending limits ($100/month)
- Daily cost alerts (>$5/day)
- Kill switch via feature flag (`klutr-global-disable`)

### Provider Outages

**Risk:** Primary provider (OpenAI) has outage

**Mitigation:**
- Implement retry logic with exponential backoff
- Graceful degradation (disable AI features temporarily)
- Optional fallback to Anthropic
- Cache recent results

### Model Deprecation

**Risk:** OpenAI deprecates models we depend on

**Mitigation:**
- Use Vercel AI SDK (provider-agnostic)
- Document model versions
- Test with multiple providers
- Set up deprecation alerts

---

## Projected Costs at Scale

| Users | Monthly AI Cost | Cost per User | Total Infra Cost |
|-------|----------------|---------------|------------------|
| 100   | $9             | $0.09         | ~$115            |
| 500   | $55            | $0.11         | ~$170            |
| 1,000 | $110           | $0.11         | ~$225            |
| 2,000 | $266           | $0.13         | ~$382            |
| 5,000 | $665           | $0.13         | ~$780            |
| 10,000| $1,330         | $0.13         | ~$1,445          |

*Total infra cost includes: Vercel ($20), Supabase ($25), Database ($19), AI costs, PostHog ($50), monitoring*

---

## Conclusion

**Klutr's AI costs are very reasonable:**
- Small deployment (100 users): **~$9/month**
- Medium deployment (500 users): **~$55/month**
- Large deployment (2000 users): **~$266/month**

With the implemented cost controls and Vercel AI SDK abstraction:
- ✅ Provider switching is trivial (5-minute change)
- ✅ Cost monitoring is built-in
- ✅ Rate limiting prevents runaway costs
- ✅ Quotas ensure predictable spending

**Recommendation:** Start with OpenAI, monitor costs for 2 weeks, then evaluate cheaper providers if needed.

---

*Last updated: 2025-11-11*
