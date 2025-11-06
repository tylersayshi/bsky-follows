# Bluesky Follows

A tool for comparing and analyzing follower relationships between Bluesky users.

## What it does

Enter two Bluesky handles and see:

- **Similarity Score**: A 0-100 metric showing how much overlap exists in your social networks (followers + following), calculated using Jaccard similarity
- **Filtered Results**: Find accounts that match specific criteria - accounts both users follow, accounts that follow both users, or any combination
- **Network Stats**: View follower and following counts for each user

## Backend

The backend is a Val.town HTTP endpoint that:

- Fetches follower/following data from Bluesky's ATP API
- Caches large accounts (5,000+ followers) with gzip compression
- Implements smart rate limiting and bot detection
- Returns data with cache status metadata

Learn more: [bsky-follows-backend](https://www.val.town/x/tylersayshi/bsky-follows-backend)

## Development

```bash
pnpm install
pnpm dev
```
