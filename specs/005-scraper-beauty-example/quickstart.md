# Quickstart: Amazon Scraper Beauty Example

**Feature**: `005-scraper-beauty-example`

## Verification

### 1. Seed the Database
Run the newly created seed command to insert the Beauty Bot.

```bash
cd backend
npx prisma db seed
```

### 2. Verify Bot Existence
Check if the bot was created.

```bash
# Verify via API (if server running)
curl http://localhost:3000/bots
```

### 3. Run the Scraper
Trigger the beauty bot to scrape.

```bash
# Assuming ID from step 2 (you might need to copy-paste the UUID)
curl -X POST http://localhost:3000/bots/<BOT_ID>/trigger
```

### 4. Check Logs
Watch the logs to see it navigating to the beauty search page and finding products.
