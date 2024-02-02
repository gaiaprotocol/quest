# Quest Backend (Supabase)

```
supabase link --project-ref XXX
supabase secrets set --env-file ./supabase/.env
supabase functions deploy store-user-avatar
supabase functions deploy link-discord-account
supabase functions deploy new-wallet-linking-nonce
supabase functions deploy link-wallet-to-user
supabase functions deploy follow-x
supabase functions deploy check-achieved
supabase db dump -f supabase/seed.sql
```
