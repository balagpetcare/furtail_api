/**
 * Phase 5 Schema Analysis Script (Node.js)
 * Parses prisma/schema.prisma, extracts all model blocks,
 * builds a relation dependency graph, and determines what can
 * safely be removed vs what must stay or be marked REVIEW.
 */
import fs from 'fs';

const SCHEMA_PATH = 'prisma/schema.prisma';

function extractModels(content) {
  const models = {};
  const pattern = /^model\s+(\w+)\s*\{/gm;
  let m;
  while ((m = pattern.exec(content)) !== null) {
    const name = m[1];
    const start = m.index;
    let depth = 0;
    let end = start;
    for (let i = m.index + m[0].length - 1; i < content.length; i++) {
      if (content[i] === '{') depth++;
      else if (content[i] === '}') {
        depth--;
        if (depth === 0) { end = i + 1; break; }
      }
    }
    models[name] = { start, end, body: content.slice(start, end) };
  }
  return models;
}

function findReferencedModels(body, allNames, selfName) {
  const refs = new Set();
  for (const name of allNames) {
    if (name === selfName) continue;
    // Match model name used as a field type (with optional ?, [])
    const re = new RegExp(`\\b${name}[?\\[]?\\s`, 'g');
    if (re.test(body)) refs.add(name);
  }
  return refs;
}

function transitiveDeps(startSet, depsMap) {
  const visited = new Set(startSet);
  const queue = [...startSet];
  while (queue.length > 0) {
    const current = queue.pop();
    for (const dep of (depsMap.get(current) || [])) {
      if (!visited.has(dep)) {
        visited.add(dep);
        queue.push(dep);
      }
    }
  }
  return visited;
}

const content = fs.readFileSync(SCHEMA_PATH, 'utf-8');
const models = extractModels(content);
const allNames = new Set(Object.keys(models));

console.log(`Total models found: ${allNames.size}`);

// Build dependency graph
const deps = new Map();
for (const [name, { body }] of Object.entries(models)) {
  deps.set(name, findReferencedModels(body, allNames, name));
}

// Reverse graph
const revDeps = new Map();
for (const [name, refs] of deps) {
  for (const ref of refs) {
    if (!revDeps.has(ref)) revDeps.set(ref, new Set());
    revDeps.get(ref).add(name);
  }
}

// KEEP list (explicit)
const KEEP = new Set([
  // Animal types
  "AnimalCategory","AnimalType","AnimalSize","AnimalColor","CoatPattern","Breed","SubBreed",
  // User & auth
  "User","UserAuth","UserProfile","UserStatsCache","UserSession",
  "UserFollow","UserProfileLike","UserFriendRequest","UserFriend",
  "UserAppSettings","UserNotificationPrefs",
  // Achievement
  "Achievement","UserAchievement","UserGalleryItem",
  // Location (owner)
  "Place","LocationPlace","UserLocationProfile","UserLocationEvent",
  // Owner profile
  "OwnerProfile","OwnerKyc","OwnerKycDocument",
  // Verification
  "VerificationLog","VerificationCase","VerificationDocument","VerificationCaseEvent",
  "VerificationLockedUpdateAttempt",
  // Notifications
  "Notification","NotificationRead","NotificationDelivery",
  // Social/posts
  "Post","PostMedia","PostLike","PostComment","PostCommentLike","Media",
  // Pet
  "Pet","PetFamilyMember","PetWeight",
  // Vaccination
  "VaccineType","Vaccination","VaccinationReminder",
  // Pet health
  "DewormingRecord","MedicalHistory","RewardHistory",
  // Wallet / fundraising
  "UserWallet","WalletTransaction","WalletWithdrawRequest","PayoutEventLog","PayoutAccount",
  "FundraisingUpdate","FundraisingAccount","FundraisingAccountStatusLog",
  "FundraisingVerificationDocument","FundraisingCampaign","FundraisingCampaignStats",
  "Donation","FundraisingPayoutMethodCatalog","FundraisingPayoutMethod",
  "FundraisingWithdrawRequest","FundraisingPayoutTransferLog",
  // Report
  "Report",
  // BD location hierarchy
  "BdDivision","BdDistrict","BdUpazila","BdUnion","BdArea",
  "CityCorporation","Area",
  // Coverage zone
  "LocationCoverageAssignment","CoverageZone","CoverageZoneArea","CoverageZoneMetadata",
  // Audit
  "AuditLog",
  // Country/state/geo
  "Country","State","LocationCity","LocationSubDistrict",
  // Policy/meta
  "CountryPolicy","PolicyFeature","PolicyDonationRule","PolicyPaymentMethod",
  "PolicyAdsRule","PolicyRule","StatePolicy","StatePolicyFeature","StatePolicyRule",
  // Ads
  "Ad",
  // Payment
  "PaymentTransaction","PaymentTransactionLog",
  // Campaign family
  "Campaign","CampaignConfig","CampaignConfigHistory",
  "CampaignLocation","CampaignSlot","CampaignVaccineType","CampaignIncludedVaccine",
  "CampaignBooking","CampaignPet","CampaignStaff",
  "CampaignSmsTemplate","CampaignSmsLog","SmsLog",
  "CampaignAuditLog","CampaignRolloutPhase","CampaignRolloutRegion",
  "CampaignPreRegistration","CampaignCheckoutSession",
]);

const keepWithDeps = transitiveDeps(KEEP, deps);
const review = new Set([...keepWithDeps].filter(m => !KEEP.has(m)));
const remove = new Set([...allNames].filter(m => !keepWithDeps.has(m)));

console.log(`\nKEEP set (direct): ${KEEP.size}`);
console.log(`KEEP set (with transitive deps): ${keepWithDeps.size}`);
console.log(`\nREVIEW models (transitive deps of KEEP, not explicitly listed): ${review.size}`);
for (const m of [...review].sort()) {
  const referencedBy = [...(revDeps.get(m) || [])].filter(r => KEEP.has(r) || review.has(r));
  console.log(`  REVIEW: ${m}  <-- referenced by: ${referencedBy.join(', ')}`);
}

console.log(`\nSAFE TO REMOVE: ${remove.size} models`);
for (const m of [...remove].sort()) {
  console.log(`  REMOVE: ${m}`);
}

console.log(`\n=== SUMMARY ===`);
console.log(`Total models: ${allNames.size}`);
console.log(`KEEP (explicit): ${[...KEEP].filter(m => allNames.has(m)).length}`);
console.log(`REVIEW (transitive deps): ${review.size}`);
console.log(`REMOVE: ${remove.size}`);

// Write remove list to file for the removal script
fs.writeFileSync('prisma/models_to_remove.json', JSON.stringify([...remove].sort(), null, 2));
fs.writeFileSync('prisma/models_to_review.json', JSON.stringify([...review].sort(), null, 2));
console.log('\nWrote prisma/models_to_remove.json and prisma/models_to_review.json');
