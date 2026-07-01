import "dotenv/config";

// Environment Guard
const allowedEnvs = ["development", "local", "test", "staging"];
const nodeEnv = process.env.NODE_ENV || "development";
const allowProduction = process.env.DUMMY_SEED_ALLOW_PRODUCTION === "true";

export function checkSafety() {
  if (!allowedEnvs.includes(nodeEnv.toLowerCase()) && !allowProduction) {
    throw new Error(
      `[Safety Guard] Seeding dummy data is blocked in environment: ${nodeEnv}. To override, set DUMMY_SEED_ALLOW_PRODUCTION=true.`
    );
  }
}

// Configurable Remote Image/Video URLs
export const USER_AVATAR_IMAGE_URLS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1527983359383-4758693f760c?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
];

export const USER_COVER_IMAGE_URLS = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&h=300&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&h=300&q=80",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&h=300&q=80",
  "https://images.unsplash.com/photo-1472214222541-d510753a8707?auto=format&fit=crop&w=800&h=300&q=80",
  "https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=800&h=300&q=80",
];

export const PET_IMAGE_URLS: Record<string, string[]> = {
  dog: [
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&h=300&q=80",
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=300&h=300&q=80",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=300&h=300&q=80",
    "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=300&h=300&q=80",
  ],
  cat: [
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&h=300&q=80",
    "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=300&h=300&q=80",
    "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=300&h=300&q=80",
    "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=300&h=300&q=80",
  ],
  bird: [
    "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=300&h=300&q=80",
    "https://images.unsplash.com/photo-1552728089-57bdde30ebd3?auto=format&fit=crop&w=300&h=300&q=80",
  ],
  rabbit: [
    "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=300&h=300&q=80",
    "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=300&h=300&q=80",
  ],
  other: [
    "https://images.unsplash.com/photo-1507666480283-421f1a4e9d73?auto=format&fit=crop&w=300&h=300&q=80",
    "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=300&h=300&q=80",
  ]
};

export const POST_IMAGE_URLS = [
  "https://images.unsplash.com/photo-1472491235688-bdc81a63246e?auto=format&fit=crop&w=600&h=400&q=80",
  "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&h=400&q=80",
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&h=400&q=80",
  "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=600&h=400&q=80",
  "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=600&h=400&q=80",
];

export const VIDEO_SAMPLE_URLS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
];

export const REEL_SAMPLE_URLS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
];

export const SAMPLE_THUMBNAILS = [
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=300&h=200&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&h=200&q=80",
  "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=300&h=200&q=80",
];
