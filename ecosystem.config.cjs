module.exports = {
  apps: [
    {
      name: "furtail-api",
      script: "dist/index.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 7200,
        REDIS_ENABLED: process.env.REDIS_ENABLED || "true",
      },
      max_memory_restart: "1G",
    },
    {
      name: "furtail-media-worker",
      script: "node_modules/ts-node/dist/bin.js",
      args: "src/common/jobs/mediaWorker.ts",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        REDIS_ENABLED: process.env.REDIS_ENABLED || "true",
        VIDEO_PROCESSING_ENABLED: process.env.VIDEO_PROCESSING_ENABLED || "true",
        VIDEO_QUEUE_CONCURRENCY: process.env.VIDEO_QUEUE_CONCURRENCY || "1",
      },
      max_memory_restart: "1500M",
    },
  ],
};