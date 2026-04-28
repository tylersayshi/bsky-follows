# Bluesky Follows

[bsky-follows.info](https://bsky-follows.info)

<img width="1710" height="986" alt="bsky follows ui showing followers of @tyler.fun compared with @chrisshank.com" src="https://github.com/user-attachments/assets/74c7721e-81d1-4339-9fb1-f368145cb0a5" />

A tool for comparing and analyzing follower relationships between Bluesky users.

## What it does

Compare two users followers + following with a [Euler Diagram](https://en.wikipedia.org/wiki/Euler_diagram). It's like a Venn Diagram, but is better for comparing sets.

> They are similar to another set diagramming technique, Venn diagrams. Unlike Venn diagrams, which show all possible relations between different sets, the Euler diagram shows only relevant relationships. - Wikipedia

This makes it trivial to look at two users mutuals, see who follows you both, or see who you're both following. Try it out!

## Backend

The backend is a Val.town HTTP endpoint that:

- Fetches follower/following data from Bluesky's ATP API
- Caches large accounts (5,000+ followers) with gzip compression

The code: [bsky-follows-backend](https://www.val.town/x/tylersayshi/bsky-follows-backend/code/main.http.ts)
