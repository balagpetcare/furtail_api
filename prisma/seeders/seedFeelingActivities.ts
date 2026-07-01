// Seed data for FeelingActivity model
// Matches the mobile feeling_activity_model.dart definitions

const FEELINGS = [
  { labelEn: "Happy", emoji: "\u{1F60A}", sortOrder: 1 },
  { labelEn: "Sad", emoji: "\u{1F622}", sortOrder: 2 },
  { labelEn: "Excited", emoji: "\u{1F929}", sortOrder: 3 },
  { labelEn: "Blessed", emoji: "\u{1F64F}", sortOrder: 4 },
  { labelEn: "Loved", emoji: "\u{1F970}", sortOrder: 5 },
  { labelEn: "Tired", emoji: "\u{1F634}", sortOrder: 6 },
  { labelEn: "Proud", emoji: "\u{1F60E}", sortOrder: 7 },
  { labelEn: "Angry", emoji: "\u{1F621}", sortOrder: 8 },
  { labelEn: "Relaxed", emoji: "\u{1F60C}", sortOrder: 9 },
  { labelEn: "Thankful", emoji: "\u{1F917}", sortOrder: 10 },
  { labelEn: "Hopeful", emoji: "\u{1F31F}", sortOrder: 11 },
  { labelEn: "Emotional", emoji: "\u{1F979}", sortOrder: 12 },
  { labelEn: "Confused", emoji: "\u{1F615}", sortOrder: 13 },
  { labelEn: "Worried", emoji: "\u{1F61F}", sortOrder: 14 },
  { labelEn: "Sick", emoji: "\u{1F912}", sortOrder: 15 },
  { labelEn: "Sleepy", emoji: "\u{1F62A}", sortOrder: 16 },
  { labelEn: "Motivated", emoji: "\u{1F4AA}", sortOrder: 17 },
  { labelEn: "Grateful", emoji: "\u{1F496}", sortOrder: 18 },
  { labelEn: "Peaceful", emoji: "\u{1F54A}", sortOrder: 19 },
  { labelEn: "Surprised", emoji: "\u{1F62E}", sortOrder: 20 },
  { labelEn: "Funny", emoji: "\u{1F604}", sortOrder: 21 },
  { labelEn: "Cute", emoji: "\u{1F97A}", sortOrder: 22 },
  { labelEn: "Cool", emoji: "\u{1F60E}", sortOrder: 23 },
  { labelEn: "Nervous", emoji: "\u{1F62C}", sortOrder: 24 },
];

const ACTIVITIES = [
  { labelEn: "Watching", emoji: "\u{1F3AC}", sortOrder: 1 },
  { labelEn: "Listening", emoji: "\u{1F3A7}", sortOrder: 2 },
  { labelEn: "Reading", emoji: "\u{1F4D6}", sortOrder: 3 },
  { labelEn: "Playing", emoji: "\u{1F3AE}", sortOrder: 4 },
  { labelEn: "Traveling", emoji: "\u{2708}\u{FE0F}", sortOrder: 5 },
  { labelEn: "Eating", emoji: "\u{1F37D}", sortOrder: 6 },
  { labelEn: "Drinking", emoji: "\u{2615}", sortOrder: 7 },
  { labelEn: "Celebrating", emoji: "\u{1F389}", sortOrder: 8 },
  { labelEn: "Working", emoji: "\u{1F4BC}", sortOrder: 9 },
  { labelEn: "Shopping", emoji: "\u{1F6CD}", sortOrder: 10 },
  { labelEn: "Cooking", emoji: "\u{1F468}\u{200D}\u{1F373}", sortOrder: 11 },
  { labelEn: "Exercising", emoji: "\u{1F3C3}", sortOrder: 12 },
  { labelEn: "Walking", emoji: "\u{1F6B6}", sortOrder: 13 },
  { labelEn: "Resting", emoji: "\u{1F6CC}", sortOrder: 14 },
];

const PET_CARE = [
  { labelEn: "With my pet", emoji: "\u{1F43E}", sortOrder: 1, isPetSpecific: true },
  { labelEn: "Feeding my pet", emoji: "\u{1F37D}", sortOrder: 2, isPetSpecific: true },
  { labelEn: "Grooming my pet", emoji: "\u{1F9FC}", sortOrder: 3, isPetSpecific: true },
  { labelEn: "Bathing my pet", emoji: "\u{1F6C1}", sortOrder: 4, isPetSpecific: true },
  { labelEn: "Walking my dog", emoji: "\u{1F415}", sortOrder: 5, isPetSpecific: true },
  { labelEn: "Playing with cat", emoji: "\u{1F408}", sortOrder: 6, isPetSpecific: true },
  { labelEn: "Training my pet", emoji: "\u{1F393}", sortOrder: 7, isPetSpecific: true },
  { labelEn: "Pet shopping", emoji: "\u{1F6CD}", sortOrder: 8, isPetSpecific: true },
  { labelEn: "Pet birthday", emoji: "\u{1F382}", sortOrder: 9, isPetSpecific: true },
  { labelEn: "Pet photo shoot", emoji: "\u{1F4F8}", sortOrder: 10, isPetSpecific: true },
  { labelEn: "Pet playtime", emoji: "\u{1F9F8}", sortOrder: 11, isPetSpecific: true },
  { labelEn: "Cleaning litter box", emoji: "\u{1F9F9}", sortOrder: 12, isPetSpecific: true },
  { labelEn: "Giving treats", emoji: "\u{1F9B4}", sortOrder: 13, isPetSpecific: true },
  { labelEn: "Cuddling my pet", emoji: "\u{1F917}", sortOrder: 14, isPetSpecific: true },
  { labelEn: "Sleeping with pet", emoji: "\u{1F634}", sortOrder: 15, isPetSpecific: true },
];

const HEALTH_VET = [
  { labelEn: "Vet visit", emoji: "\u{1FA7A}", sortOrder: 1, isPetSpecific: true },
  { labelEn: "Pet vaccination", emoji: "\u{1F489}", sortOrder: 2, isPetSpecific: true },
  { labelEn: "Deworming", emoji: "\u{1F48A}", sortOrder: 3, isPetSpecific: true },
  { labelEn: "Pet checkup", emoji: "\u{1F3E5}", sortOrder: 4, isPetSpecific: true },
  { labelEn: "Pet recovery", emoji: "\u{2764}\u{FE0F}\u{200D}\u{1FA79}", sortOrder: 5, isPetSpecific: true },
  { labelEn: "Pet medicine", emoji: "\u{1F48A}", sortOrder: 6, isPetSpecific: true },
  { labelEn: "Emergency care", emoji: "\u{1F691}", sortOrder: 7, isPetSpecific: true },
  { labelEn: "Surgery care", emoji: "\u{1F3E5}", sortOrder: 8, isPetSpecific: true },
  { labelEn: "Dental care", emoji: "\u{1F9B7}", sortOrder: 9, isPetSpecific: true },
  { labelEn: "Health concern", emoji: "\u{26A0}\u{FE0F}", sortOrder: 10, isPetSpecific: true },
];

const RESCUE_ADOPTION = [
  { labelEn: "Searching lost pet", emoji: "\u{1F50E}", sortOrder: 1, isPetSpecific: true },
  { labelEn: "Found a pet", emoji: "\u{1F43E}", sortOrder: 2, isPetSpecific: true },
  { labelEn: "Rescuing pet", emoji: "\u{1F6DF}", sortOrder: 3, isPetSpecific: true },
  { labelEn: "Adoption day", emoji: "\u{1F3E1}", sortOrder: 4, isPetSpecific: true },
  { labelEn: "Looking for adopter", emoji: "\u{2764}\u{FE0F}", sortOrder: 5, isPetSpecific: true },
  { labelEn: "Foster care", emoji: "\u{1F3E0}", sortOrder: 6, isPetSpecific: true },
  { labelEn: "Reunited with pet", emoji: "\u{1F91D}", sortOrder: 7, isPetSpecific: true },
  { labelEn: "Helping stray animals", emoji: "\u{1F415}", sortOrder: 8, isPetSpecific: true },
  { labelEn: "Feeding stray animals", emoji: "\u{1F372}", sortOrder: 9, isPetSpecific: true },
  { labelEn: "Animal welfare", emoji: "\u{1F49A}", sortOrder: 10, isPetSpecific: true },
];

function buildItems(list, type, category) {
  return list.map((item) => ({
    type,
    category,
    labelEn: item.labelEn,
    labelBn: null,
    emoji: item.emoji,
    iconName: null,
    sortOrder: item.sortOrder,
    isActive: true,
    isPetSpecific: item.isPetSpecific || false,
    usageCount: 0,
  }));
}

export default async function seedFeelingActivities(prisma) {
  // Delete existing records to avoid duplicates on re-seed
  await prisma.feelingActivity.deleteMany({});
  console.log("  ✓ Cleared old feeling_activities");

  const all = [
    ...buildItems(FEELINGS, "FEELING", "Feelings"),
    ...buildItems(ACTIVITIES, "ACTIVITY", "Activities"),
    ...buildItems(PET_CARE, "ACTIVITY", "Pet Care"),
    ...buildItems(HEALTH_VET, "ACTIVITY", "Health & Vet"),
    ...buildItems(RESCUE_ADOPTION, "ACTIVITY", "Lost & Rescue"),
  ];

  await prisma.feelingActivity.createMany({ data: all });
  console.log(`  ✓ Seeded ${all.length} feeling/activity items`);
}
