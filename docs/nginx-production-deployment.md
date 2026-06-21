# Furtail Production Nginx Deployment

Deployment-ready reverse-proxy configuration for:

| Host | App | Upstream (default) |
|------|-----|-------------------|
| `furtail.world` | `furtail-landing` | `127.0.0.1:3101` |
| `www.furtail.world` | → apex redirect | — |
| `vaccination.furtail.world` | `vaccination_2026` | `127.0.0.1:3110` |

**Source files:** `infra/nginx/`

---

## Features

- TLS 1.2/1.3 via **Let's Encrypt** (certbot)
- **Rate limiting** — general, static asset, and API-auth zones
- **Security headers** — HSTS, CSP baseline, Permissions-Policy, etc.
- **Gzip** + optional **Brotli**
- Next.js-friendly proxy (`/_next/static` long-cache, WebSocket headers)
- Campaign `/api/*` → `backend-api:3000`

---

## Server prerequisites

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

# Optional Brotli (disable 04-brotli.conf if unavailable)
sudo apt install -y libnginx-mod-http-brotli-filter libnginx-mod-http-brotli-static
```

DNS (before TLS):

| Record | Value |
|--------|--------|
| `A` / `AAAA` `furtail.world` | Server public IP |
| `CNAME` `www` | `furtail.world` |
| `CNAME` `vaccination` | `furtail.world` or same IP |

---

## Install configuration

```bash
cd /path/to/backend-api

# Snippets & shared conf
sudo cp infra/nginx/conf.d/*.conf /etc/nginx/conf.d/
sudo cp infra/nginx/snippets/*.conf /etc/nginx/snippets/

# Site blocks
sudo cp infra/nginx/sites-available/*.conf /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/00-acme-and-redirect.conf /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/furtail.world.conf /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/vaccination.furtail.world.conf /etc/nginx/sites-enabled/

# ACME webroot
sudo mkdir -p /var/www/certbot

# Test (disable brotli if module missing)
sudo nginx -t
```

---

## Let's Encrypt SSL

### Option A — certbot nginx plugin (recommended)

```bash
sudo certbot --nginx \
  -d furtail.world \
  -d www.furtail.world \
  -d vaccination.furtail.world \
  --email admin@furtail.world \
  --agree-tos \
  --no-eff-email
```

Certbot updates certificate paths in server blocks. Align with `snippets/ssl-letsencrypt.conf` or let certbot manage `ssl_certificate` directives directly.

### Option B — webroot (HTTP-01 only)

```bash
sudo certbot certonly --webroot -w /var/www/certbot \
  -d furtail.world \
  -d www.furtail.world \
  -d vaccination.furtail.world
```

Certificate path used in configs:

```
/etc/letsencrypt/live/furtail.world/fullchain.pem
/etc/letsencrypt/live/furtail.world/privkey.pem
```

### Auto-renewal

```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
sudo certbot renew --dry-run
```

---

## Start application upstreams

Run Next.js in production mode before enabling nginx:

```bash
# furtail-landing
cd /opt/furtail/furtail-landing && npm run build && npm run start   # binds :3101

# vaccination_2026
cd /opt/furtail/vaccination_2026 && npm run build && npm run start  # binds :3110

# backend-api (campaign /api proxy)
cd /opt/furtail/backend-api && npm run start  # :3000
```

Use **systemd** or **PM2** for persistence. Update `infra/nginx/conf.d/00-upstreams.conf` if ports or hosts differ.

---

## Reload nginx

```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## Rate limits (tuning)

| Zone | Rate | Applied to |
|------|------|------------|
| `bpa_general` | 30 req/s | HTML pages |
| `bpa_static` | 120 req/s | `/_next/static`, images |
| `bpa_api_auth` | 10 req/min | `/api/` on campaign host |
| `bpa_conn_per_ip` | 40 concurrent | Per server block |

Adjust in `conf.d/01-rate-limit.conf`. Monitor `429` in access logs.

---

## Security notes

1. **CSP** in `snippets/security-headers.conf` is a baseline — tighten after auditing third-party scripts (GA4, Meta, Clarity, payment iframes).
2. **`/vaccination`** on apex is served by **furtail-landing** (bridge page). No nginx 301 to subdomain unless marketing requests it.
3. Payment webhooks must hit `api.furtail.world` only — not these vhosts.
4. Enable `limit_req_status 429` logging in fail2ban if needed.

---

## Health checks

```bash
curl -I https://furtail.world/
curl -I https://vaccination.furtail.world/
curl -I https://vaccination.furtail.world/api/health  # if API exposes health
```

---

## Related docs

- [docs/infrastructure/PORT_AND_DOMAIN_MAP.md](./infrastructure/PORT_AND_DOMAIN_MAP.md) — canonical port and host matrix
- `docs/architecture/furtail-vaccination-domain-strategy.md` §4 Nginx plan
- `docs/seo/` (furtail-landing) — canonical URL strategy for apex `/vaccination`
