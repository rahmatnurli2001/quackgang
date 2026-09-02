QUACK GANG whitelist for quackgang.xyz

Deploy with Cloudflare Workers + D1.
1. Create D1 database named quackgang.
2. Put its ID into wrangler.toml.
3. Run schema.sql.
4. Deploy worker.js and public/.
5. Attach quackgang.xyz as the custom domain.
6. Add Cloudflare Turnstile server-side for production anti-bot protection.
7. Replace the three X links with the exact official pinned-post URL.

Important: this starter stores wallets and prevents duplicates/caps at 1,000. The Follow/Like/Repost buttons do not prove that an X action happened; real verification requires an X API integration.
