# AI Cost Estimate Report

**Generated:** 2025-01-27  
**Pricing Source:** OpenAI (as of 2025-01-27)

## Overview

This report estimates monthly AI API costs for Klutr at different usage tiers. Costs are based on OpenAI pricing for:
- `text-embedding-3-small`: $0.02 per 1M tokens (input)
- `gpt-4o-mini`: $0.15 per 1M tokens (input), $0.60 per 1M tokens (output)

## Usage Tiers

### Small Tier (100 users, 10 notes/user/month)

**Usage:**
- Embeddings: 1,000/month
- Classifications: 1,000/month
- Taggings: 1,000/month
- Summarizations: 100/month
- Insights: 100/month
- Chat messages: 500/month

**Estimated Monthly Cost:** ~$0.50
**Estimated Yearly Cost:** ~$6.00

### Medium Tier (1,000 users, 50 notes/user/month)

**Usage:**
- Embeddings: 50,000/month
- Classifications: 50,000/month
- Taggings: 50,000/month
- Summarizations: 5,000/month
- Insights: 1,000/month
- Chat messages: 10,000/month

**Estimated Monthly Cost:** ~$25.00
**Estimated Yearly Cost:** ~$300.00

### Large Tier (10,000 users, 100 notes/user/month)

**Usage:**
- Embeddings: 1,000,000/month
- Classifications: 1,000,000/month
- Taggings: 1,000,000/month
- Summarizations: 100,000/month
- Insights: 10,000/month
- Chat messages: 200,000/month

**Estimated Monthly Cost:** ~$500.00
**Estimated Yearly Cost:** ~$6,000.00

## Cost Breakdown by Feature

### Embeddings
- Model: `text-embedding-3-small`
- Cost: $0.02 per 1M tokens
- Average tokens per request: 100
- Small: ~$0.002/month
- Medium: ~$0.10/month
- Large: ~$2.00/month

### Classifications
- Model: `gpt-4o-mini`
- Cost: ~$0.000075 per request (100 input + 50 output tokens)
- Small: ~$0.075/month
- Medium: ~$3.75/month
- Large: ~$75.00/month

### Taggings
- Model: `gpt-4o-mini`
- Cost: ~$0.000045 per request (100 input + 30 output tokens)
- Small: ~$0.045/month
- Medium: ~$2.25/month
- Large: ~$45.00/month

### Summarizations
- Model: `gpt-4o-mini`
- Cost: ~$0.00018 per request (200 input + 200 output tokens)
- Small: ~$0.018/month
- Medium: ~$0.90/month
- Large: ~$18.00/month

### Insights
- Model: `gpt-4o-mini`
- Cost: ~$0.0012 per request (2000 input + 500 output tokens)
- Small: ~$0.12/month
- Medium: ~$1.20/month
- Large: ~$12.00/month

### Chat
- Model: `gpt-4o-mini`
- Cost: ~$0.00018 per request (200 input + 200 output tokens)
- Small: ~$0.09/month
- Medium: ~$1.80/month
- Large: ~$36.00/month

## Cost Optimization Strategies

1. **Batch Processing**: Group multiple requests to reduce API calls
2. **Caching**: Cache embeddings and classifications for identical content
3. **Model Selection**: Use `gpt-4o-mini` for cost-effective operations
4. **Rate Limiting**: Implement per-user quotas to prevent runaway costs
5. **Monitoring**: Track actual usage vs estimates and adjust

## Notes

- Costs assume average token counts per request
- Actual costs may vary based on content length
- Pricing may change - verify current rates before production deployment
- Consider implementing cost alerts and budgets
