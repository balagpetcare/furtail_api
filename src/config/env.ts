require("dotenv").config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 7200),
  apiPrefix: process.env.API_PREFIX || "/api/v1",

  // Public URLs for share links (safe defaults)
  publicWebUrl: process.env.PUBLIC_WEB_URL || "https://furtail.app",
  publicDeepLinkScheme: process.env.PUBLIC_DEEPLINK_SCHEME || "furtail",
};

module.exports = { env };

export {};
