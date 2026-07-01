# Video Compression Pipeline — Production Deployment Guide

**Scope:** Server-side video transcoding via `mediaWorker.ts` (BullMQ + FFmpeg + MinIO/S3).
**Applies to:** `furtail_api` v10.0.0.6+, migration `20260623204854_add_media_processing_error`.
**DO NOT run these commands automatically** — each step requires manual confirmation.

---

## Pre-deployment Checklist

- [ ] Redis 7 is running and accessible from the API server
- [ ] `ffmpeg-static` npm package installed (bundled in `node_modules`)
- [ ] MinIO/S3 bucket accessible with write permissions on `raw_videos/`, `thumbnails/`, opt prefixes
- [ ] DB migration `20260623204854_add_media_processing_error` has been applied
- [ ] `REDIS_ENABLED=true` and `REDIS_URL` set in production `.env`
- [ ] Nginx `client_max_body_size` is ≥ 100m on the API vhost
- [ ] PM2 installed globally on the server (`npm install -g pm2`)
- [ ] Flutter APK updated (handles PENDING/FAILED video states)

---

## 1. Required Production Environment Variables

These must be set in the production `.env` (or injected by your secrets manager).
Values marked `REQUIRED` have no safe default.

### Core server

```env
NODE_ENV=production
PORT=7200
HOST=0.0.0.0
API_PREFIX=/api/v1
```

### Database

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME    # REQUIRED
```

### Auth

```env
JWT_SECRET=<min-32-char-random-secret>    # REQUIRED
JWT_EXPIRES_IN=7d
```

### Redis (NEW — must set for video pipeline)

```env
REDIS_ENABLED=true
REDIS_URL=redis://localhost:6379           # preferred over REDIS_HOST/PORT
# If Redis requires auth:
# REDIS_URL=redis://:PASSWORD@localhost:6379
# TLS (Upstash / Redis Cloud):
# REDIS_URL=rediss://USER:PASSWORD@host:6380
REDIS_CONNECT_TIMEOUT_MS=5000
REDIS_MAX_CONNECT_RETRIES=10
```

> **Why:** `REDIS_ENABLED=false` (the dev default) makes `getVideoProcessingQueue()` return `null`,
> silently dropping all video jobs. The worker also exits immediately at startup if Redis is disabled.

### Storage (MinIO or Backblaze B2)

For MinIO:
```env
STORAGE_PROVIDER=minio
AWS_ENDPOINT=https://storage.your-domain.com     # REQUIRED — MinIO S3-compatible endpoint
AWS_BUCKET_NAME=furtail-media                    # REQUIRED
AWS_ACCESS_KEY_ID=<access-key>                   # REQUIRED
AWS_SECRET_ACCESS_KEY=<secret-key>               # REQUIRED
AWS_REGION=us-east-1
AWS_FORCE_PATH_STYLE=true
STORAGE_PUBLIC_URL=https://storage.your-domain.com   # REQUIRED — public CDN/download base
STORAGE_USE_COUNTRY_PREFIX=true
```

For Backblaze B2:
```env
STORAGE_PROVIDER=b2
S3_ENDPOINT=https://s3.us-east-005.backblazeb2.com   # REQUIRED
S3_BUCKET=furtail-production-media                   # REQUIRED
S3_ACCESS_KEY=<key-id>                               # REQUIRED
S3_SECRET_KEY=<application-key>                      # REQUIRED
S3_REGION=us-east-005
S3_FORCE_PATH_STYLE=true
STORAGE_PUBLIC_URL=https://f005.backblazeb2.com/file/furtail-production-media   # REQUIRED
```

### Media / upload policy

```env
MAX_UPLOAD_BYTES=104857600       # 100 MB — must match nginx client_max_body_size
IMAGE_MAX_SIDE=1600
IMAGE_JPEG_QUALITY=82
PROFILE_PHOTO_MAX_SIDE=512
PROFILE_PHOTO_WEBP_QUALITY=82
VIDEO_TRANSCODE=false            # Legacy sync transcode is OFF — async worker handles all video
UPLOAD_DIR=uploads               # Temp disk dir for multer; os.tmpdir() used for worker temp files
```

### Video worker tuning

```env
VIDEO_QUEUE_CONCURRENCY=1        # Number of simultaneous FFmpeg transcoding jobs
                                 # Increase only if server has spare CPU cores
FFMPEG_PATH=                     # Leave empty — ffmpeg-static binary is used automatically
```

---

## 2. Redis Requirement

The media worker **cannot start** without Redis. Redis is used for:
- BullMQ job queue (`video_processing`)
- Job retry (3 attempts, exponential backoff starting at 5 s)
- Job history (100 completed / 200 failed records kept)

### Verify Redis is running

```bash
redis-cli ping
# Expected: PONG

redis-cli info server | grep redis_version
# Expected: redis_version:7.x.x
```

### Start Redis (if using Docker)

```bash
# Start the furtail-redis container from docker-compose.yml
docker compose up -d furtail-redis

# Confirm health
docker exec furtail-redis redis-cli ping
```

### Start Redis (if using system service)

```bash
sudo systemctl start redis-server
sudo systemctl enable redis-server
systemctl status redis-server
```

---

## 3. FFmpeg Availability

FFmpeg is provided by the `ffmpeg-static` npm package (bundled in `node_modules`).
**No system-level FFmpeg installation is required** as long as `npm install` has been run.

Verify the binary is present after install:

```bash
cd /opt/furtail/furtail_api
node -e "const p = require('ffmpeg-static'); console.log('ffmpeg-static:', p); require('child_process').execSync(p + ' -version', {stdio:'inherit'});"
# Expected first line: ffmpeg version 6.1.x ...
```

If `FFMPEG_PATH` is set in `.env`, it overrides `ffmpeg-static`. Leave it empty to use the bundled binary.

> **Note for Alpine Linux / Docker:** `ffmpeg-static` bundles a statically-linked binary and works
> without libc dependencies. No `apt install ffmpeg` needed.

---

## 4. PM2 Process Setup

Install PM2 globally if not already present:

```bash
npm install -g pm2
```

Create `/opt/furtail/furtail_api/ecosystem.config.js`:

```js
module.exports = {
  apps: [
    {
      name: 'furtail-api',
      script: 'dist/index.js',
      cwd: '/opt/furtail/furtail_api',
      instances: 1,          // increase for multi-core; media worker must stay at 1
      exec_mode: 'fork',
      env_file: '/opt/furtail/furtail_api/.env',
      max_memory_restart: '512M',
      restart_delay: 3000,
      log_file: '/var/log/furtail/api-combined.log',
      error_file: '/var/log/furtail/api-error.log',
      out_file: '/var/log/furtail/api-out.log',
      time: true,
    },
    {
      name: 'furtail-media-worker',
      script: 'src/common/jobs/mediaWorker.ts',
      interpreter: 'node',
      interpreter_args: '-r ts-node/register',
      cwd: '/opt/furtail/furtail_api',
      instances: 1,           // ALWAYS 1 — FFmpeg is CPU-bound; adjust VIDEO_QUEUE_CONCURRENCY instead
      exec_mode: 'fork',
      env_file: '/opt/furtail/furtail_api/.env',
      env: {
        TS_NODE_TRANSPILE_ONLY: '1',
      },
      max_memory_restart: '768M',   // FFmpeg transcoding can use 200–400 MB per job
      restart_delay: 5000,
      log_file: '/var/log/furtail/worker-combined.log',
      error_file: '/var/log/furtail/worker-error.log',
      out_file: '/var/log/furtail/worker-out.log',
      time: true,
    },
  ],
};
```

> **Alternative for production (compiled):** Replace `src/common/jobs/mediaWorker.ts` with
> `dist/common/jobs/mediaWorker.js` and remove `interpreter_args` after running `npm run build`.

Create log directory:

```bash
sudo mkdir -p /var/log/furtail
sudo chown $(whoami):$(whoami) /var/log/furtail
```

---

## 5. Prisma Migration Deployment

The migration `20260623204854_add_media_processing_error` adds one nullable column to the `media` table:

```sql
ALTER TABLE "media" ADD COLUMN "processingError" TEXT;
```

This is a **safe, non-destructive, zero-downtime migration** — it adds a nullable column with no default, so:
- Existing rows are unaffected.
- The running API continues to serve requests during migration.
- Migration takes < 1 second on any table size.

**Run before starting the new worker code:**

```bash
cd /opt/furtail/furtail_api

# Verify migration is pending
node scripts/run-local-prisma.cjs migrate status

# Apply
node scripts/run-local-prisma.cjs migrate deploy

# Confirm schema is in sync
node scripts/run-local-prisma.cjs validate
```

**Also regenerate the Prisma client after migration:**

```bash
node scripts/run-local-prisma.cjs generate
```

---

## 6. Nginx Upload Limit Verification

The API accepts video uploads up to `MAX_UPLOAD_BYTES=104857600` (100 MB) in multer.
Nginx must allow at least that much or multer will never receive the body.

### Current config

`infra/nginx/snippets/proxy-api.conf` already sets:

```nginx
client_max_body_size 100m;
proxy_read_timeout   120s;
proxy_send_timeout   120s;
proxy_connect_timeout 15s;
```

These values are included automatically when that snippet is used in a site block.

### Verify on the server

```bash
# Check active Nginx config
sudo nginx -T | grep client_max_body_size

# Expected output (at minimum):
#   client_max_body_size 100m;
```

If the API vhost does not include `proxy-api.conf`, add the upload limit manually to the server block
that proxies to the API:

```nginx
# In the location block that proxies to furtail-api (port 7200):
location /api/ {
    client_max_body_size 100m;
    proxy_read_timeout   120s;
    proxy_pass http://127.0.0.1:7200;
    include /etc/nginx/snippets/proxy-api.conf;
}
```

After any nginx config change:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## 7. Storage Bucket Prefix Permissions

The video pipeline writes to three key prefixes in the bucket. All three must allow the API credentials to `PutObject`, `GetObject`, and `DeleteObject`.

| Prefix | Written by | Purpose |
|--------|-----------|---------|
| `raw_videos/<userId>/` | API upload handler (`media.controller.ts`) | Stores raw uploaded video before transcoding |
| `opt/<userId>/` or `<folder>/<userId>/` | Media worker | Stores transcoded H.264 MP4 |
| `thumbnails/<userId>/` | Media worker | Stores extracted JPEG thumbnail |

If `STORAGE_USE_COUNTRY_PREFIX=true`, all keys are prefixed with a 2-char country code, e.g. `BD/raw_videos/…`.

### Verify bucket write access (MinIO)

```bash
cd /opt/furtail/furtail_api

# Run the built-in storage upload test
node scripts/test-minio-upload.mjs

# Expected output:
#   STORAGE_PROVIDER: minio
#   Bucket: furtail-media  Endpoint: https://storage.your-domain.com
#   { key: 'BD/media/0/test_...txt', url: '...', getStatus: 200, ok: true, body: '...' }
```

### Verify object existence and deletion (confirming worker permissions)

```bash
node scripts/list-minio-objects.mjs
# Should list current objects — confirms GetObject permission
```

### MinIO bucket policy (if using MinIO console)

In the MinIO console → Buckets → `furtail-media` → Access Policy, ensure the service account
key (`AWS_ACCESS_KEY_ID`) has the following actions on the bucket:

```
s3:GetObject
s3:PutObject
s3:DeleteObject
s3:ListBucket
s3:HeadObject
```

If using an IAM-style policy JSON:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject","s3:PutObject","s3:DeleteObject","s3:HeadObject","s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::furtail-media",
        "arn:aws:s3:::furtail-media/*"
      ]
    }
  ]
}
```

---

## 8. How to Restart the API Safely

The API is stateless between requests. A rolling restart is safe at any time.

```bash
cd /opt/furtail/furtail_api

# 1. Build new TypeScript to dist/
npm run build

# 2. Regenerate Prisma client
node scripts/run-local-prisma.cjs generate

# 3. Graceful PM2 reload (zero-downtime if instances > 1; instant for instances=1)
pm2 reload furtail-api

# 4. Confirm the process is running
pm2 status furtail-api
pm2 logs furtail-api --lines 30
```

**Health check after restart:**

```bash
curl http://localhost:7200/health
# Expected: {"ok":true,"service":"bpa_api"}

curl http://localhost:7200/health/redis
# Expected: {"ok":true,...}  when REDIS_ENABLED=true
```

---

## 9. How to Start the Media Worker Safely

The worker must start **after** the API and Redis are both healthy.

```bash
cd /opt/furtail/furtail_api

# 1. Confirm Redis is reachable
redis-cli ping         # PONG

# 2. Confirm the DB migration has been applied
node scripts/run-local-prisma.cjs migrate status
# Expected: "Database schema is up to date"

# 3. Start the worker via PM2
pm2 start ecosystem.config.js --only furtail-media-worker

# 4. Verify startup logs
pm2 logs furtail-media-worker --lines 20
```

**Expected startup log lines:**

```
[WorkerEnv] Loaded .env
[Redis] {"msg":"Redis ready","host":"localhost","port":6379,...}
[MediaWorker] Connected to Redis successfully.
[MediaWorker] Set FFmpeg binary path to: /opt/furtail/furtail_api/node_modules/ffmpeg-static/ffmpeg
[MediaWorker] Starting worker on queue: video_processing (concurrency: 1)
```

**Save PM2 process list so it survives reboots:**

```bash
pm2 save
pm2 startup   # Follow the printed command to register the systemd unit
```

---

## 10. How to Verify One Test Video After Deployment

Run the included verification script in a non-destructive mode on the production server.
This will upload a 3-second synthetic video, transcode it, and clean up.

> **Pre-conditions:** API must be running, Redis must be up, worker must be started.

```bash
cd /opt/furtail/furtail_api

# Run the pipeline verification script
node -r ts-node/register scripts/verify-video-pipeline.ts
```

**Expected result:**

```
PASS: 24   FAIL: 0   SKIP: 0
```

All 24 checks including Redis, queue, PENDING→PROCESSING→READY transition, thumbnail upload,
raw delete, FAILED state, image upload, profile avatar, and Flutter state handling should pass.
SKIPs are only expected if Redis is disabled (which must not be the case in production).

**Manual API-level test (using curl with a real auth token):**

```bash
# Get a valid JWT token by logging in
TOKEN=$(curl -s -X POST http://localhost:7200/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"<phone>","password":"<password>"}' | jq -r '.data.token')

# Upload a small test video
curl -X POST http://localhost:7200/api/v1/media/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/tmp/test.mp4" \
  -F "folder=posts" \
  | jq '{id:.data.id, status:.data.status, url:.data.url}'

# Expected: {"id": 123, "status": "PENDING", "url": "...raw_videos/..."}

# Poll until READY (worker picks it up in seconds)
MEDIA_ID=123
for i in $(seq 1 30); do
  STATUS=$(curl -s http://localhost:7200/api/v1/media/my \
    -H "Authorization: Bearer $TOKEN" \
    | jq -r ".data[] | select(.id == $MEDIA_ID) | .status")
  echo "[$i] status: $STATUS"
  [ "$STATUS" = "READY" ] && break
  sleep 3
done
```

**Watch worker logs in real time:**

```bash
pm2 logs furtail-media-worker --lines 0 --raw
```

---

## 11. Rollback Plan if Worker Fails

The worker failure **does not affect the API or image uploads**. Only new video processing stops.
Videos already at READY status continue to play normally.

### Immediate containment

```bash
# Stop the failing worker without affecting the API
pm2 stop furtail-media-worker

# Check why it failed
pm2 logs furtail-media-worker --lines 100 --err
```

### Common failure causes and fixes

| Symptom in logs | Root cause | Fix |
|-----------------|-----------|-----|
| `Redis connection failed after 10 retries` | Redis down or wrong `REDIS_URL` | Fix Redis → `pm2 restart furtail-media-worker` |
| `DATABASE_URL must be set` | `.env` not loaded by worker | Confirm `workerEnv.bootstrap.ts` finds `.env`; check `ecosystem.config.js` `env_file` path |
| `FFmpeg binary not found` | `node_modules` incomplete | Run `npm ci` then restart |
| `NoSuchKey` / `The specified key does not exist` | Raw video deleted before worker ran | Re-enqueue manually (see §12) |
| `ffmpeg failed (1): libx264 not found` | `ffmpeg-static` binary is wrong arch | Run `npm rebuild ffmpeg-static` |
| Worker OOM killed by OS | Video too large for available RAM | Raise `max_memory_restart` in ecosystem.config.js or reduce `VIDEO_QUEUE_CONCURRENCY` to 1 |

### Roll back the migration (if needed)

The `processingError` column is purely additive. The **old worker code** (without the `processingError`
write) is still compatible with the schema — it simply won't write that field.

If you must revert the migration:

```bash
# Manual rollback SQL — run on production DB via psql or your DB client
psql $DATABASE_URL -c "ALTER TABLE media DROP COLUMN IF EXISTS \"processingError\";"

# Then redeploy the previous API version (without the column reference)
```

> **Do not run `prisma migrate reset`** — that drops all data.

### Revert posts.service.ts mediaSelect change (if needed)

If the new `status`/`thumbnailUrl`/`thumbnailKey` fields in `mediaSelect` cause unexpected issues,
revert `src/api/v1/modules/posts/posts.service.ts` line 5 to:

```ts
const mediaSelect = { id: true, url: true, key: true, type: true };
```

Then rebuild and reload the API. The Flutter app gracefully defaults to `status='READY'` when
the field is absent from the response.

---

## 12. How to Handle Videos Stuck in PENDING

A video is stuck in PENDING when:
- The worker was not running when the job was enqueued
- Redis restarted and the job was lost (BullMQ persists jobs in Redis, not in the DB)
- The job exceeded its 3 retry attempts and is in the `failed` BullMQ state

### Check for stuck PENDING records

```bash
cd /opt/furtail/furtail_api

node -r ts-node/register -e "
const prisma = require('./src/infrastructure/db/prismaClient');
prisma.media.findMany({
  where: { status: { in: ['PENDING', 'PROCESSING'] } },
  select: { id: true, status: true, createdAt: true, mimeType: true, ownerUserId: true, key: true }
}).then(rows => { console.table(rows); return prisma.\$disconnect(); });
"
```

### Re-enqueue stuck jobs via script

```bash
node -r ts-node/register -e "
require('./src/common/jobs/workerEnv.bootstrap');
const prisma = require('./src/infrastructure/db/prismaClient');
const { addVideoProcessingJob, areRedisQueuesEnabled, waitForRedisReady } = require('./src/infrastructure/redis/redis.client');
const { addVideoProcessingJob: enqueue } = require('./src/common/queue/queues');

(async () => {
  const stuck = await prisma.media.findMany({
    where: { status: 'PENDING', type: 'VIDEO' },
    select: { id: true, key: true, originalKey: true, ownerUserId: true }
  });
  console.log('Found', stuck.length, 'stuck PENDING videos');
  for (const m of stuck) {
    const rawKey = m.originalKey || m.key;
    if (!rawKey) { console.log('Skip mediaId', m.id, '— no key'); continue; }
    const jobId = await enqueue({ mediaId: m.id, rawKey, folder: 'posts', ownerUserId: m.ownerUserId });
    console.log('Re-enqueued mediaId', m.id, 'as job', jobId);
  }
  await prisma.\$disconnect();
  process.exit(0);
})();
"
```

> **Note:** The worker will skip records that are not in PENDING or PROCESSING status (line 53 of
> `mediaWorker.ts`). Re-enqueueing is idempotent for PENDING records.

### Force-reset a single video to PENDING and re-enqueue

If a specific video is stuck at PROCESSING (worker died mid-job):

```bash
MEDIA_ID=123
node -r ts-node/register -e "
require('./src/common/jobs/workerEnv.bootstrap');
const prisma = require('./src/infrastructure/db/prismaClient');
const { addVideoProcessingJob } = require('./src/common/queue/queues');
(async () => {
  const m = await prisma.media.findUnique({ where: { id: $MEDIA_ID } });
  if (!m) { console.log('Not found'); process.exit(1); }
  await prisma.media.update({ where: { id: $MEDIA_ID }, data: { status: 'PENDING', processingError: null } });
  const rawKey = m.originalKey || m.key;
  const jobId = await addVideoProcessingJob({ mediaId: $MEDIA_ID, rawKey, folder: 'posts', ownerUserId: m.ownerUserId });
  console.log('Reset and re-enqueued as job', jobId);
  await prisma.\$disconnect();
  process.exit(0);
})();
"
```

---

## Summary — Exact Command Sequence for Initial Deployment

Run in this order on the production server. **Do not skip steps.**

```bash
# 0. Pull latest code
cd /opt/furtail/furtail_api
git pull origin main

# 1. Install dependencies (includes ffmpeg-static binary)
npm ci

# 2. Apply DB migration (safe — adds nullable column only)
node scripts/run-local-prisma.cjs migrate deploy

# 3. Regenerate Prisma client
node scripts/run-local-prisma.cjs generate

# 4. Run npm verify (must pass before continuing)
npm run verify

# 5. Build TypeScript
npm run build

# 6. Confirm Redis is running
redis-cli ping

# 7. Reload API (zero-downtime)
pm2 reload furtail-api

# 8. Verify API health
curl http://localhost:7200/health
curl http://localhost:7200/health/redis

# 9. Start media worker (NEW process)
pm2 start ecosystem.config.js --only furtail-media-worker

# 10. Verify worker startup
pm2 logs furtail-media-worker --lines 20

# 11. Save PM2 list so worker restarts on reboot
pm2 save

# 12. Run end-to-end pipeline verification
node -r ts-node/register scripts/verify-video-pipeline.ts

# 13. Verify nginx upload limit
sudo nginx -T | grep client_max_body_size
```

---

## Quick-Reference Card

| Task | Command |
|------|---------|
| Start all | `pm2 start ecosystem.config.js` |
| Reload API | `pm2 reload furtail-api` |
| Start worker | `pm2 start ecosystem.config.js --only furtail-media-worker` |
| Stop worker | `pm2 stop furtail-media-worker` |
| Restart worker | `pm2 restart furtail-media-worker` |
| API logs | `pm2 logs furtail-api --lines 50` |
| Worker logs | `pm2 logs furtail-media-worker --lines 50` |
| Worker errors | `pm2 logs furtail-media-worker --lines 100 --err` |
| Redis health | `redis-cli ping` |
| DB migration | `node scripts/run-local-prisma.cjs migrate deploy` |
| Full verify | `node -r ts-node/register scripts/verify-video-pipeline.ts` |
| Nginx reload | `sudo nginx -t && sudo systemctl reload nginx` |
| Stuck videos | See §12 above |
| Rollback worker | `pm2 stop furtail-media-worker` (API unaffected) |
