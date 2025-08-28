# Learned Strategies

This directory contains optimization strategies discovered through AI learning from collective user data.

## Structure

- `browsers/` - Browser optimization improvements
- `communication/` - Chat/email app improvements  
- `creative/` - Design and creative app improvements
- `development/` - IDE and development tool improvements
- `media/` - Media player and editor improvements
- `productivity/` - Productivity app improvements

## Strategy Format

Learned strategies are stored as JSON files with the following structure:

```json
{
  "appId": "com.example.app",
  "version": "1.2.3",
  "validatedAt": "2024-01-01T00:00:00Z",
  "confidence": 0.95,
  "sampleSize": 1000,
  "thresholdAdjustments": {
    "criticalThreshold": 50
  },
  "strategyImprovements": {
    "conservative": {
      "estimatedSavings": { "memory": 200 },
      "newActions": []
    }
  },
  "contextualImprovements": {}
}
```

## Safety

All learned strategies undergo:
1. Statistical validation (min 95% confidence, 100+ samples)
2. Human review and approval
3. A/B testing with gradual rollout
4. Continuous monitoring with rollback capability