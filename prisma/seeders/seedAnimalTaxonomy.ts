import { PrismaClient, Prisma } from "@prisma/client";

/** Canonical breed name for local/native/indigenous animals; required for every animal type. */
export const LOCAL_INDIGENOUS_BREED_NAME = "Local / Indigenous";

/** Alias names for search/display; avoids duplicate rows for Local, Deshi, Native, Indigenous. */
export const LOCAL_INDIGENOUS_ALIAS_NAMES: string[] = ["Local", "Indigenous", "Deshi", "Native"];

/**
 * Enterprise animal taxonomy seed: categories → types → breeds;
 * standalone: colors, coat patterns, sizes.
 * Single source of truth for GET /api/v1/common/* taxonomy endpoints.
 * Uses type assertion so this file compiles when Prisma client may not yet include taxonomy models.
 * Run `npx prisma generate` after schema changes before running seed.
 */
export default async function seedAnimalTaxonomy(prisma: PrismaClient) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = prisma as any;
  console.log("🌱 Seeding enterprise animal taxonomy...");

  // ── 1) Animal categories ──────────────────────────────────────────────────
  const categories: { code: string; name: string; displayOrder: number }[] = [
    { code: "mammal",    name: "Mammal",    displayOrder: 1 },
    { code: "bird",      name: "Bird",      displayOrder: 2 },
    { code: "reptile",   name: "Reptile",   displayOrder: 3 },
    { code: "fish",      name: "Fish",      displayOrder: 4 },
    { code: "amphibian", name: "Amphibian", displayOrder: 5 },
    { code: "exotic",    name: "Exotic",    displayOrder: 6 },
    { code: "other",     name: "Other",     displayOrder: 7 },
  ];
  for (const c of categories) {
    await db.animalCategory.upsert({
      where:  { code: c.code },
      update: { name: c.name, displayOrder: c.displayOrder },
      create: { code: c.code, name: c.name, displayOrder: c.displayOrder },
    });
  }

  const mammalCat  = await db.animalCategory.findUnique({ where: { code: "mammal"  } });
  const birdCat    = await db.animalCategory.findUnique({ where: { code: "bird"    } });
  const reptileCat = await db.animalCategory.findUnique({ where: { code: "reptile" } });
  const fishCat    = await db.animalCategory.findUnique({ where: { code: "fish"    } });
  const otherCat   = await db.animalCategory.findUnique({ where: { code: "other"   } });

  // ── 2) Animal sizes ───────────────────────────────────────────────────────
  const sizes: { code: string; name: string; minKg?: number; maxKg?: number; order: number }[] = [
    { code: "extra_small", name: "Extra Small",                  maxKg: 2.5,  order: 1 },
    { code: "toy",         name: "Toy",         minKg: 2.5,      maxKg: 5,    order: 2 },
    { code: "small",       name: "Small",        minKg: 5,        maxKg: 12,   order: 3 },
    { code: "medium",      name: "Medium",       minKg: 12,       maxKg: 25,   order: 4 },
    { code: "large",       name: "Large",        minKg: 25,       maxKg: 45,   order: 5 },
    { code: "giant",       name: "Giant",        minKg: 45,                    order: 6 },
  ];
  const sizeIds: Record<string, number> = {};
  for (const s of sizes) {
    const row = await db.animalSize.upsert({
      where:  { code: s.code },
      update: { name: s.name, minWeightKg: s.minKg ?? null, maxWeightKg: s.maxKg ?? null, displayOrder: s.order },
      create: { code: s.code, name: s.name, minWeightKg: s.minKg ?? null, maxWeightKg: s.maxKg ?? null, displayOrder: s.order },
    });
    sizeIds[s.code] = row.id;
  }

  // ── 3) Animal colors ──────────────────────────────────────────────────────
  const colors: { code: string; name: string; hex?: string; order: number }[] = [
    { code: "black",         name: "Black",          hex: "#1a1a1a", order: 1  },
    { code: "white",         name: "White",          hex: "#f5f5f5", order: 2  },
    { code: "brown",         name: "Brown",          hex: "#8B4513", order: 3  },
    { code: "golden",        name: "Golden",         hex: "#DAA520", order: 4  },
    { code: "cream",         name: "Cream",          hex: "#FFFDD0", order: 5  },
    { code: "grey",          name: "Grey",           hex: "#808080", order: 6  },
    { code: "blue_grey",     name: "Blue Grey",      hex: "#6699AA", order: 7  },
    { code: "orange",        name: "Orange",         hex: "#FF8C00", order: 8  },
    { code: "ginger",        name: "Ginger",         hex: "#B5451B", order: 9  },
    { code: "calico",        name: "Calico",                         order: 10 },
    { code: "tortoiseshell", name: "Tortoiseshell",                  order: 11 },
    { code: "tabby",         name: "Tabby",                          order: 12 },
    { code: "spotted",       name: "Spotted",                        order: 13 },
    { code: "mixed",         name: "Mixed",                          order: 14 },
    { code: "other",         name: "Other",                          order: 15 },
    // Legacy extras kept for backward compat
    { code: "red",           name: "Red",            hex: "#CD5C5C", order: 16 },
    { code: "fawn",          name: "Fawn",           hex: "#E5AA70", order: 17 },
    { code: "blue",          name: "Blue",           hex: "#4682B4", order: 18 },
    { code: "silver",        name: "Silver",         hex: "#C0C0C0", order: 19 },
    { code: "chocolate",     name: "Chocolate",      hex: "#D2691E", order: 20 },
    { code: "tan",           name: "Tan",            hex: "#D2B48C", order: 21 },
    { code: "yellow",        name: "Yellow",         hex: "#FFD700", order: 22 },
    { code: "black_white",   name: "Black & White",                  order: 23 },
    { code: "brown_white",   name: "Brown & White",                  order: 24 },
    { code: "tricolor",      name: "Tricolor",                       order: 25 },
    { code: "bicolor",       name: "Bicolor",                        order: 26 },
    { code: "brindle",       name: "Brindle",                        order: 27 },
    { code: "merle",         name: "Merle",                          order: 28 },
  ];
  for (const c of colors) {
    await db.animalColor.upsert({
      where:  { code: c.code },
      update: { name: c.name, hexPreview: c.hex ?? null, displayOrder: c.order },
      create: { code: c.code, name: c.name, hexPreview: c.hex ?? null, displayOrder: c.order },
    });
  }

  // ── 4) Coat patterns ──────────────────────────────────────────────────────
  const coatPatterns: { code: string; name: string; order: number }[] = [
    { code: "solid",         name: "Solid",          order: 1  },
    { code: "bicolor",       name: "Bi-color",       order: 2  },
    { code: "tricolor",      name: "Tri-color",      order: 3  },
    { code: "tabby",         name: "Tabby",          order: 4  },
    { code: "calico",        name: "Calico",         order: 5  },
    { code: "tortoiseshell", name: "Tortoiseshell",  order: 6  },
    { code: "spotted",       name: "Spotted",        order: 7  },
    { code: "striped",       name: "Striped",        order: 8  },
    { code: "merle",         name: "Merle",          order: 9  },
    { code: "brindle",       name: "Brindle",        order: 10 },
    { code: "mixed",         name: "Mixed",          order: 11 },
    { code: "other",         name: "Other",          order: 12 },
    // Legacy kept for backward compat
    { code: "harlequin",     name: "Harlequin",      order: 13 },
  ];
  for (const p of coatPatterns) {
    await db.coatPattern.upsert({
      where:  { code: p.code },
      update: { name: p.name, displayOrder: p.order },
      create: { code: p.code, name: p.name, displayOrder: p.order },
    });
  }

  // ── 5) Animal types ───────────────────────────────────────────────────────
  // Required by Flutter app: Dog, Cat, Bird, Rabbit, Hamster, Guinea Pig, Fish, Turtle, Reptile, Other
  // Legacy types kept to avoid FK violations on existing pet records.
  const typeRows: { name: string; code: string; categoryId: number | null; order: number }[] = [
    // Primary types (Flutter dropdown)
    { name: "Dog",         code: "dog",         categoryId: mammalCat!.id,  order: 1  },
    { name: "Cat",         code: "cat",         categoryId: mammalCat!.id,  order: 2  },
    { name: "Bird",        code: "bird",        categoryId: birdCat!.id,    order: 3  },
    { name: "Rabbit",      code: "rabbit",      categoryId: mammalCat!.id,  order: 4  },
    { name: "Hamster",     code: "hamster",     categoryId: mammalCat!.id,  order: 5  },
    { name: "Guinea Pig",  code: "guinea_pig",  categoryId: mammalCat!.id,  order: 6  },
    { name: "Fish",        code: "fish",        categoryId: fishCat!.id,    order: 7  },
    { name: "Turtle",      code: "turtle",      categoryId: reptileCat!.id, order: 8  },
    { name: "Reptile",     code: "reptile",     categoryId: reptileCat!.id, order: 9  },
    { name: "Other",       code: "other",       categoryId: otherCat!.id,   order: 10 },
    // Legacy types (kept for FK safety; not shown in main Flutter dropdown)
    { name: "Parrot",      code: "parrot",      categoryId: birdCat!.id,    order: 11 },
    { name: "Pigeon",      code: "pigeon",      categoryId: birdCat!.id,    order: 12 },
    { name: "Budgerigar",  code: "budgerigar",  categoryId: birdCat!.id,    order: 13 },
    { name: "Snake",       code: "snake",       categoryId: reptileCat!.id, order: 14 },
    { name: "Cow",         code: "cow",         categoryId: mammalCat!.id,  order: 15 },
    { name: "Goat",        code: "goat",        categoryId: mammalCat!.id,  order: 16 },
    { name: "Horse",       code: "horse",       categoryId: mammalCat!.id,  order: 17 },
  ];

  const typeIds: Record<string, number> = {};
  for (const t of typeRows) {
    const row = await db.animalType.upsert({
      where:  { name: t.name },
      update: { code: t.code, categoryId: t.categoryId, displayOrder: t.order, isActive: true },
      create: { name: t.name, code: t.code, categoryId: t.categoryId, displayOrder: t.order, isActive: true },
    });
    typeIds[t.code] = row.id;
  }

  // ── 6) Breeds ─────────────────────────────────────────────────────────────

  type BreedDef = {
    name: string;
    aliasNames?: string[];
    defaultSize?: string;
    isMixed?: boolean;
    isOther?: boolean;
    order?: number;
  };

  async function upsertBreeds(animalTypeId: number, breeds: BreedDef[]) {
    for (let i = 0; i < breeds.length; i++) {
      const b = breeds[i];
      const base = {
        aliasNames:    b.aliasNames ? (b.aliasNames as Prisma.InputJsonValue) : null,
        defaultSizeId: b.defaultSize ? (sizeIds[b.defaultSize] ?? null) : null,
        isMixed:       b.isMixed  ?? false,
        isOther:       b.isOther  ?? false,
        displayOrder:  b.order ?? i + 1,
        isActive:      true,
      };
      await db.breed.upsert({
        where:  { name_animalTypeId: { name: b.name, animalTypeId } },
        update: base,
        create: { name: b.name, animalTypeId, ...base },
      });
    }
  }

  // Dog breeds
  await upsertBreeds(typeIds.dog, [
    { name: "Labrador Retriever",  defaultSize: "large",  order: 1  },
    { name: "Golden Retriever",    defaultSize: "large",  order: 2  },
    { name: "German Shepherd",     defaultSize: "large",  order: 3  },
    { name: "Rottweiler",          defaultSize: "large",  order: 4  },
    { name: "Doberman Pinscher",   defaultSize: "large",  aliasNames: ["Doberman"], order: 5 },
    { name: "Beagle",              defaultSize: "medium", order: 6  },
    { name: "Pug",                 defaultSize: "small",  order: 7  },
    { name: "Shih Tzu",            defaultSize: "small",  order: 8  },
    { name: "Spitz",               defaultSize: "small",  order: 9  },
    { name: "Siberian Husky",      defaultSize: "large",  aliasNames: ["Husky"], order: 10 },
    { name: "Pomeranian",          defaultSize: "toy",    order: 11 },
    { name: "Cocker Spaniel",      defaultSize: "medium", order: 12 },
    { name: "Indie / Local Dog",   defaultSize: "medium", aliasNames: ["Indie", "Deshi Dog", "Street Dog", "Local Dog", "Parish Dog"], order: 13 },
    { name: "Bulldog",             defaultSize: "medium", order: 20 },
    { name: "French Bulldog",      defaultSize: "small",  order: 21 },
    { name: "Poodle",              defaultSize: "medium", order: 22 },
    { name: "Yorkshire Terrier",   defaultSize: "toy",    order: 23 },
    { name: "Boxer",               defaultSize: "large",  order: 24 },
    { name: "Dachshund",           defaultSize: "small",  order: 25 },
    { name: "Chihuahua",           defaultSize: "toy",    order: 26 },
    { name: "Maltese",             defaultSize: "toy",    order: 27 },
    { name: "Dalmatian",           defaultSize: "large",  order: 28 },
    { name: "Border Collie",       defaultSize: "medium", order: 29 },
    { name: "Akita",               defaultSize: "large",  order: 30 },
    { name: "St. Bernard",         defaultSize: "giant",  order: 31 },
    { name: "Great Dane",          defaultSize: "giant",  order: 32 },
    { name: "Australian Shepherd", defaultSize: "medium", order: 33 },
    { name: "Samoyed",             defaultSize: "medium", order: 34 },
    { name: "Lhasa Apso",          defaultSize: "small",  order: 35 },
    { name: "Mixed Breed",         isMixed: true,  defaultSize: "medium", order: 98 },
    { name: "Other",               isOther: true,                         order: 99 },
  ]);

  // Cat breeds
  await upsertBreeds(typeIds.cat, [
    { name: "Persian",              defaultSize: "medium", order: 1  },
    { name: "Bengal",               defaultSize: "medium", order: 2  },
    { name: "Siamese",              defaultSize: "medium", order: 3  },
    { name: "Maine Coon",           defaultSize: "large",  order: 4  },
    { name: "British Shorthair",    defaultSize: "medium", order: 5  },
    { name: "Scottish Fold",        defaultSize: "medium", order: 6  },
    { name: "Ragdoll",              defaultSize: "large",  order: 7  },
    { name: "Domestic Shorthair",   defaultSize: "medium", order: 8  },
    { name: "Domestic Longhair",    defaultSize: "medium", order: 9  },
    { name: "Local Cat",            defaultSize: "medium", aliasNames: ["Deshi Cat", "Indigenous Cat"], order: 10 },
    { name: "Abyssinian",           defaultSize: "medium", order: 11 },
    { name: "Sphynx",               defaultSize: "medium", order: 12 },
    { name: "Russian Blue",         defaultSize: "medium", order: 13 },
    { name: "Burmese",              defaultSize: "medium", order: 14 },
    { name: "Himalayan",            defaultSize: "medium", order: 15 },
    { name: "American Shorthair",   defaultSize: "medium", order: 16 },
    { name: "Exotic Shorthair",     defaultSize: "medium", order: 17 },
    { name: "Norwegian Forest Cat", defaultSize: "large",  order: 18 },
    { name: "Turkish Angora",       defaultSize: "medium", order: 19 },
    { name: "Birman",               defaultSize: "medium", order: 20 },
    { name: "Tonkinese",            defaultSize: "medium", order: 21 },
    { name: "Savannah",             defaultSize: "large",  order: 22 },
    { name: "Devon Rex",            defaultSize: "small",  order: 23 },
    { name: "Cornish Rex",          defaultSize: "small",  order: 24 },
    { name: "Mixed Breed",          isMixed: true, defaultSize: "medium", order: 98 },
    { name: "Other",                isOther: true,                        order: 99 },
  ]);

  // Bird breeds (under the unified "Bird" type)
  await upsertBreeds(typeIds.bird, [
    { name: "Budgerigar",  aliasNames: ["Budgie", "Parakeet"], order: 1 },
    { name: "Cockatiel",                                        order: 2 },
    { name: "Lovebird",                                         order: 3 },
    { name: "Parrot",      aliasNames: ["African Grey"],        order: 4 },
    { name: "Macaw",                                            order: 5 },
    { name: "Canary",                                           order: 6 },
    { name: "Finch",                                            order: 7 },
    { name: "Pigeon",      aliasNames: ["Racing Pigeon"],       order: 8 },
    { name: "Dove",                                             order: 9 },
    { name: "Cockatoo",                                         order: 10 },
    { name: "Conure",                                           order: 11 },
    { name: "Other",       isOther: true,                       order: 99 },
  ]);

  // Rabbit breeds
  await upsertBreeds(typeIds.rabbit, [
    { name: "Holland Lop",       order: 1  },
    { name: "Netherland Dwarf",  order: 2  },
    { name: "Lionhead",          order: 3  },
    { name: "Mini Rex",          order: 4  },
    { name: "Angora",            order: 5  },
    { name: "Flemish Giant",     order: 6  },
    { name: "Dutch",             order: 7  },
    { name: "Rex",               order: 8  },
    { name: "New Zealand",       order: 9  },
    { name: "Local Rabbit",      aliasNames: ["Deshi Rabbit", "Indigenous Rabbit"], order: 10 },
    { name: "Mixed Breed",       isMixed: true, order: 98 },
    { name: "Other",             isOther: true, order: 99 },
  ]);

  // Hamster breeds
  await upsertBreeds(typeIds.hamster, [
    { name: "Syrian",          aliasNames: ["Golden Hamster"], order: 1 },
    { name: "Dwarf Campbell",  order: 2 },
    { name: "Roborovski",      aliasNames: ["Robo Dwarf"],     order: 3 },
    { name: "Winter White",    aliasNames: ["Djungarian"],     order: 4 },
    { name: "Chinese Hamster", order: 5 },
    { name: "Other",           isOther: true,                  order: 99 },
  ]);

  // Guinea Pig breeds
  await upsertBreeds(typeIds.guinea_pig, [
    { name: "American",   order: 1 },
    { name: "Abyssinian", order: 2 },
    { name: "Peruvian",   order: 3 },
    { name: "Teddy",      order: 4 },
    { name: "Silkie",     order: 5 },
    { name: "Other",      isOther: true, order: 99 },
  ]);

  // Fish breeds
  await upsertBreeds(typeIds.fish, [
    { name: "Goldfish",   order: 1  },
    { name: "Betta",      aliasNames: ["Fighting Fish", "Siamese Fighting Fish"], order: 2 },
    { name: "Guppy",      order: 3  },
    { name: "Molly",      order: 4  },
    { name: "Platy",      order: 5  },
    { name: "Angelfish",  order: 6  },
    { name: "Koi",        order: 7  },
    { name: "Oscar",      order: 8  },
    { name: "Neon Tetra", order: 9  },
    { name: "Flowerhorn", order: 10 },
    { name: "Arowana",    order: 11 },
    { name: "Other",      isOther: true, order: 99 },
  ]);

  // Turtle breeds
  await upsertBreeds(typeIds.turtle, [
    { name: "Red-eared Slider",    order: 1 },
    { name: "Indian Roofed Turtle",order: 2 },
    { name: "Box Turtle",          order: 3 },
    { name: "Painted Turtle",      order: 4 },
    { name: "Map Turtle",          order: 5 },
    { name: "Other",               isOther: true, order: 99 },
  ]);

  // Reptile breeds (general reptile type — excludes Snake which has its own legacy type)
  await upsertBreeds(typeIds.reptile, [
    { name: "Leopard Gecko",   order: 1 },
    { name: "Bearded Dragon",  order: 2 },
    { name: "Iguana",          order: 3 },
    { name: "Ball Python",     order: 4 },
    { name: "Corn Snake",      order: 5 },
    { name: "Blue-tongued Skink", order: 6 },
    { name: "Chameleon",       order: 7 },
    { name: "Monitor Lizard",  order: 8 },
    { name: "Other",           isOther: true, order: 99 },
  ]);

  // Other
  await upsertBreeds(typeIds.other, [
    { name: "Mixed", isMixed: true, order: 1 },
    { name: "Other", isOther: true, order: 2 },
  ]);

  // Legacy breed stubs for legacy animal types (ensures FK-safe base data)
  const legacyParrotBreeds: BreedDef[] = [
    { name: "Cockatiel" }, { name: "Budgerigar" }, { name: "African Grey" },
    { name: "Macaw" }, { name: "Lovebird" }, { name: "Conure" },
    { name: "Parakeet" }, { name: "Canary" }, { name: "Finch" },
    { name: "Mixed", isMixed: true }, { name: "Other", isOther: true },
  ];
  await upsertBreeds(typeIds.parrot, legacyParrotBreeds);

  await upsertBreeds(typeIds.pigeon, [
    { name: "Racing" }, { name: "Fantail" }, { name: "Mixed", isMixed: true }, { name: "Other", isOther: true },
  ]);

  await upsertBreeds(typeIds.budgerigar, [
    { name: "English" }, { name: "American" }, { name: "Mixed", isMixed: true }, { name: "Other", isOther: true },
  ]);

  await upsertBreeds(typeIds.snake, [
    { name: "Ball Python" }, { name: "Corn Snake" }, { name: "King Snake" },
    { name: "Boa Constrictor" }, { name: "Other", isOther: true },
  ]);

  // ── 7) Ensure "Local / Indigenous" breed exists for every active animal type ──
  const allTypes = await db.animalType.findMany({ select: { id: true, name: true } });
  const aliasJson = LOCAL_INDIGENOUS_ALIAS_NAMES as Prisma.InputJsonValue;
  for (const at of allTypes) {
    const existing = await db.breed.findUnique({
      where: { name_animalTypeId: { name: LOCAL_INDIGENOUS_BREED_NAME, animalTypeId: at.id } },
    });
    if (existing) {
      await db.breed.update({
        where: { id: existing.id },
        data: { aliasNames: aliasJson, isActive: true },
      });
      continue;
    }
    const legacyNames = ["Local / Deshi", "Local", "Indigenous", "Native", "Deshi"];
    const legacy = await db.breed.findFirst({
      where: { animalTypeId: at.id, name: { in: legacyNames } },
    });
    if (legacy) {
      await db.breed.update({
        where: { id: legacy.id },
        data: { name: LOCAL_INDIGENOUS_BREED_NAME, aliasNames: aliasJson, isActive: true },
      });
      continue;
    }
    await db.breed.create({
      data: {
        name:         LOCAL_INDIGENOUS_BREED_NAME,
        animalTypeId: at.id,
        aliasNames:   aliasJson,
        displayOrder: 0,
        isActive:     true,
      },
    });
  }

  // ── 8) Sub-breeds (minimal — only for legacy compatibility, no new ones added) ──
  const gsBreed = await db.breed.findUnique({
    where: { name_animalTypeId: { name: "German Shepherd", animalTypeId: typeIds.dog } },
  });
  if (gsBreed) {
    for (const sub of [
      { code: "working_line", name: "Working Line" },
      { code: "show_line",    name: "Show Line"    },
    ]) {
      await db.subBreed.upsert({
        where:  { breedId_code: { breedId: gsBreed.id, code: sub.code } },
        update: { name: sub.name },
        create: { breedId: gsBreed.id, code: sub.code, name: sub.name },
      });
    }
  }

  const persianBreed = await db.breed.findUnique({
    where: { name_animalTypeId: { name: "Persian", animalTypeId: typeIds.cat } },
  });
  if (persianBreed) {
    for (const sub of [
      { code: "doll_face", name: "Doll Face" },
      { code: "peke_face", name: "Peke Face" },
    ]) {
      await db.subBreed.upsert({
        where:  { breedId_code: { breedId: persianBreed.id, code: sub.code } },
        update: { name: sub.name },
        create: { breedId: persianBreed.id, code: sub.code, name: sub.name },
      });
    }
  }

  console.log("✅ Enterprise animal taxonomy seeded.");
}

/**
 * Ensures the mandatory "Local / Indigenous" breed exists for the given animal type.
 * Call this when creating a new animal type so it always has this default breed option.
 */
export async function ensureLocalIndigenousBreedForType(
  prisma: PrismaClient,
  animalTypeId: number,
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = prisma as any;
  const aliasJson = LOCAL_INDIGENOUS_ALIAS_NAMES as Prisma.InputJsonValue;
  const existing = await db.breed.findUnique({
    where: { name_animalTypeId: { name: LOCAL_INDIGENOUS_BREED_NAME, animalTypeId } },
  });
  if (existing) {
    await db.breed.update({
      where: { id: existing.id },
      data: { aliasNames: aliasJson, isActive: true },
    });
    return;
  }
  const legacyNames = ["Local / Deshi", "Local", "Indigenous", "Native", "Deshi"];
  const legacy = await db.breed.findFirst({
    where: { animalTypeId, name: { in: legacyNames } },
  });
  if (legacy) {
    await db.breed.update({
      where: { id: legacy.id },
      data: { name: LOCAL_INDIGENOUS_BREED_NAME, aliasNames: aliasJson, isActive: true },
    });
    return;
  }
  await db.breed.create({
    data: {
      name:         LOCAL_INDIGENOUS_BREED_NAME,
      animalTypeId,
      aliasNames:   aliasJson,
      displayOrder: 0,
      isActive:     true,
    },
  });
}
