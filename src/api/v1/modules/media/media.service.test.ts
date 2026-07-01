jest.mock("../../../../infrastructure/db/prismaClient", () => ({
  media: {
    findFirst: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  },
}));

const mockProvider = {
  config: {
    provider: "minio",
    bucketName: "furtail-pets",
    endpoint: "http://localhost:9000",
    publicUrl: "http://localhost:9000",
  },
  putObject: jest.fn(),
  deleteObject: jest.fn(),
  objectExists: jest.fn(),
  buildPublicUrl: jest.fn(
    (key: string) => `http://localhost:9000/furtail-pets/${key}`,
  ),
};

jest.mock("../../../../infrastructure/storage/storage.factory", () => ({
  getStorageProvider: () => mockProvider,
}));

describe("media.service uploadAndCreateMedia", () => {
  const prisma = require("../../../../infrastructure/db/prismaClient");
  const mediaService = require("./media.service");

  beforeEach(() => {
    jest.clearAllMocks();
    mockProvider.putObject.mockResolvedValue(undefined);
    mockProvider.deleteObject.mockResolvedValue(undefined);
    mockProvider.objectExists.mockResolvedValue(true);
  });

  it("reuses existing media for the same owner", async () => {
    prisma.media.findFirst.mockResolvedValueOnce({
      id: 10,
      ownerUserId: 7,
      key: "media/7/existing.jpg",
      url: "http://localhost:9000/furtail-pets/media/7/existing.jpg",
      type: "IMAGE",
      mimeType: "image/jpeg",
      sizeBytes: 123,
      hash: "same-owner-hash",
      deletedAt: null,
    });

    const result = await mediaService.uploadAndCreateMedia({
      ownerUserId: 7,
      file: {
        buffer: Buffer.from("same-owner"),
        mimetype: "image/jpeg",
        originalname: "same-owner.jpg",
        size: 10,
      },
      folder: "media",
    });

    expect(prisma.media.create).not.toHaveBeenCalled();
    expect(result.id).toBe(10);
    expect(result.url).toContain("existing.jpg");
  });

  it("creates a new media row with null hash when another owner already has the same file", async () => {
    prisma.media.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 99, ownerUserId: 21 });
    prisma.media.create.mockImplementation(async ({ data }: { data: any }) => ({
      id: 11,
      ...data,
    }));

    const result = await mediaService.uploadAndCreateMedia({
      ownerUserId: 7,
      file: {
        buffer: Buffer.from("cross-owner"),
        mimetype: "image/jpeg",
        originalname: "cross-owner.jpg",
        size: 12,
      },
      folder: "media",
    });

    expect(prisma.media.create).toHaveBeenCalledTimes(1);
    expect(prisma.media.create.mock.calls[0][0].data.hash).toBeNull();
    expect(result.ownerUserId).toBe(7);
    expect(mockProvider.putObject).toHaveBeenCalledTimes(1);
  });

  it("wraps storage failures with a stable error code", async () => {
    mockProvider.putObject.mockRejectedValueOnce(new Error("bucket offline"));

    await expect(
      mediaService.uploadAndCreateMedia({
        ownerUserId: 7,
        file: {
          buffer: Buffer.from("boom"),
          mimetype: "image/jpeg",
          originalname: "boom.jpg",
          size: 4,
        },
        folder: "media",
      }),
    ).rejects.toMatchObject({
      statusCode: 502,
      code: "STORAGE_UPLOAD_FAILED",
    });
  });
});
