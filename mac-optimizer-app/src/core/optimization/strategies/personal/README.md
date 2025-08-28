# Personal Strategies

This directory contains user-specific optimization preferences and customizations.

## Structure

Personal strategies are organized by user preference type:

- `preferences.json` - User's strategy preferences (conservative/balanced/aggressive)
- `time-preferences.json` - Time-based optimization preferences
- `risk-tolerance.json` - User's risk tolerance settings
- `app-overrides/` - Per-app customization overrides

## Strategy Format

Personal preferences are stored locally and contain:

```json
{
  "userId": "user-device-id",
  "preferences": {
    "preferredStrategies": ["balanced"],
    "timePreferences": {
      "workingHours": {
        "start": "09:00",
        "end": "17:00",
        "strategy": "conservative"
      }
    },
    "riskTolerance": "medium",
    "appOverrides": {
      "com.google.Chrome": {
        "maxMemoryThreshold": 2000,
        "preferredStrategy": "aggressive"
      }
    }
  },
  "lastUpdated": "2024-01-01T00:00:00Z"
}
```

## Privacy

Personal strategies are:
- Stored locally only
- Never shared with cloud services
- Encrypted with device-specific keys
- Used to customize base + learned strategies for individual users