import { checkSafety } from "./dummySeeder.config";
import { seedDummyUsers } from "./dummyUsers.seeder";
import { seedDummyPets } from "./dummyPets.seeder";
import { seedDummyPosts } from "./dummyPosts.seeder";
import { seedDummyVideos } from "./dummyMedia.seeder";
import { seedDummyReels } from "./dummyReels.seeder";
import { clearDummyData } from "./dummyClear.seeder";

async function run() {
  try {
    // Safety check first
    checkSafety();

    const args = process.argv.slice(2);
    let dryRun = false;
    let batchSize = 50;
    
    // Commands/modes
    let mode: "users" | "pets" | "posts" | "videos" | "reels" | "all" | "clear" | null = null;
    
    // Individual counts
    let count: number | null = null;

    // "All" counts
    let usersCount = 50;
    let petsCount = 100;
    let postsCount = 200;
    let videosCount = 50;
    let reelsCount = 50;

    let confirm = false;
    let force = false;

    for (const arg of args) {
      if (arg === "--dry-run") {
        dryRun = true;
      } else if (arg.startsWith("--batch=")) {
        batchSize = parseInt(arg.split("=")[1], 10) || 50;
      } else if (arg.startsWith("--count=")) {
        count = parseInt(arg.split("=")[1], 10);
      } else if (arg.startsWith("--users=")) {
        usersCount = parseInt(arg.split("=")[1], 10) || 50;
      } else if (arg.startsWith("--pets=")) {
        petsCount = parseInt(arg.split("=")[1], 10) || 100;
      } else if (arg.startsWith("--posts=")) {
        postsCount = parseInt(arg.split("=")[1], 10) || 200;
      } else if (arg.startsWith("--videos=")) {
        videosCount = parseInt(arg.split("=")[1], 10) || 50;
      } else if (arg.startsWith("--reels=")) {
        reelsCount = parseInt(arg.split("=")[1], 10) || 50;
      } else if (arg === "--users") {
        mode = "users";
      } else if (arg === "--pets") {
        mode = "pets";
      } else if (arg === "--posts") {
        mode = "posts";
      } else if (arg === "--videos") {
        mode = "videos";
      } else if (arg === "--reels") {
        mode = "reels";
      } else if (arg === "--all") {
        mode = "all";
      } else if (arg === "--clear") {
        mode = "clear";
      } else if (arg === "--confirm") {
        confirm = true;
      } else if (arg === "--force") {
        force = true;
      }
    }

    if (!mode) {
      console.log("Usage: node index.ts [--users|--pets|--posts|--videos|--reels|--all|--clear] [options]");
      process.exit(1);
    }

    console.log(`[Dummy Seeder] Running in mode: ${mode.toUpperCase()} ${dryRun ? "(DRY RUN)" : ""}`);

    if (mode === "clear") {
      if (!confirm) {
        console.warn("Warning: You must provide --confirm to clear dummy data. Exiting.");
        process.exit(1);
      }
      const summary = await clearDummyData(dryRun);
      console.log(`\n--- Clear Summary ---`);
      console.log(`Deleted: ${summary.deleted}`);
      console.log(`Skipped: ${summary.skipped}`);
      console.log(`Failed:  ${summary.failed}`);
      return;
    }

    const validateCount = (c: number, name: string) => {
      if (c < 0) {
        console.error(`Error: ${name} count cannot be negative (${c}).`);
        process.exit(1);
      }
      if (c > 1000 && !force) {
        console.error(`Error: ${name} count is very large (${c}). Use --force to allow.`);
        process.exit(1);
      }
    };

    if (mode === "users") {
      const targetCount = count !== null ? count : 50;
      validateCount(targetCount, "Users");
      console.log(`Seeding ${targetCount} users...`);
      const summary = await seedDummyUsers(targetCount, dryRun, batchSize);
      printSummary("Users", summary);
    } else if (mode === "pets") {
      const targetCount = count !== null ? count : 100;
      validateCount(targetCount, "Pets");
      console.log(`Seeding ${targetCount} pets...`);
      const summary = await seedDummyPets(targetCount, dryRun, batchSize);
      printSummary("Pets", summary);
    } else if (mode === "posts") {
      const targetCount = count !== null ? count : 200;
      validateCount(targetCount, "Posts");
      console.log(`Seeding ${targetCount} posts...`);
      const summary = await seedDummyPosts(targetCount, dryRun, batchSize);
      printSummary("Posts", summary);
    } else if (mode === "videos") {
      const targetCount = count !== null ? count : 50;
      validateCount(targetCount, "Videos");
      console.log(`Seeding ${targetCount} videos...`);
      const summary = await seedDummyVideos(targetCount, dryRun, batchSize);
      printSummary("Videos", summary);
    } else if (mode === "reels") {
      const targetCount = count !== null ? count : 50;
      validateCount(targetCount, "Reels");
      console.log(`Seeding ${targetCount} reels...`);
      const summary = await seedDummyReels(targetCount, dryRun, batchSize);
      printSummary("Reels", summary);
    } else if (mode === "all") {
      validateCount(usersCount, "Users");
      validateCount(petsCount, "Pets");
      validateCount(postsCount, "Posts");
      validateCount(videosCount, "Videos");
      validateCount(reelsCount, "Reels");
      console.log(`Seeding all assets (Users: ${usersCount}, Pets: ${petsCount}, Posts: ${postsCount}, Videos: ${videosCount}, Reels: ${reelsCount})...`);
      
      console.log(`\n[1/5] Seeding Users...`);
      const userSummary = await seedDummyUsers(usersCount, dryRun, batchSize);
      printSummary("Users", userSummary);

      console.log(`\n[2/5] Seeding Pets...`);
      const petSummary = await seedDummyPets(petsCount, dryRun, batchSize);
      printSummary("Pets", petSummary);

      console.log(`\n[3/5] Seeding Posts...`);
      const postSummary = await seedDummyPosts(postsCount, dryRun, batchSize);
      printSummary("Posts", postSummary);

      console.log(`\n[4/5] Seeding Videos...`);
      const videoSummary = await seedDummyVideos(videosCount, dryRun, batchSize);
      printSummary("Videos", videoSummary);

      console.log(`\n[5/5] Seeding Reels...`);
      const reelSummary = await seedDummyReels(reelsCount, dryRun, batchSize);
      printSummary("Reels", reelSummary);
    }

  } catch (err) {
    console.error("Seeder execution failed:", err);
    process.exit(1);
  }
}

function printSummary(name: string, summary: any) {
  console.log(`\n--- ${name} Seeding Summary ---`);
  console.log(`Created: ${summary.created}`);
  console.log(`Skipped: ${summary.skipped}`);
  console.log(`Updated: ${summary.updated}`);
  console.log(`Failed:  ${summary.failed}`);
}

run();
