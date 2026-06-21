import type { Request, Response, NextFunction } from "express";
import prisma from "../../../../infrastructure/db/prismaClient";
import {
  createLocationEvent,
  setManualLocation,
  getLocation as getLocationFromService,
} from "./location.service";
import {
  validateLocationEventBody,
  validateLocationManualBody,
} from "./location.validators";
import { buildGeoKeys } from "./adGeoKeys.service";

function getAuthUserId(req: any): number | null {
  const id =
    req?.user?.id ??
    req?.userId ??
    req?.auth?.userId ??
    req?.authUser?.id ??
    req?.session?.user?.id;

  const n = Number(id);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = getAuthUserId(req as any);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        status: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      data: {
        user,
        orgMembers: [],
        branchAccess: [],
        roles: [],
        permissions: Array.isArray((req as any)?.user?.permissions)
          ? (req as any).user.permissions.map((p: unknown) => String(p))
          : [],
      },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/v1/me/notifications
 * Returns unread notifications for the authenticated user
 */
export async function getNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = getAuthUserId(req as any);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        readAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    return res.json({
      success: true,
      data: notifications,
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/v1/me/location
 * Returns { profile, currentPlace, homePlace, manualOverridePlace, events, geoKeys }.
 */
export async function getLocation(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = getAuthUserId(req as any);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const data = await getLocationFromService(prisma, userId);
    const effectiveHome = data.manualOverridePlace ?? data.inferredHomePlace ?? data.homePlace;
    const geoKeys = buildGeoKeys({
      profile: data.profile,
      currentPlace: data.currentPlace,
      homePlace: effectiveHome,
      recentlyIn: data.recentlyIn ?? undefined,
    });
    return res.json({ success: true, data: { ...data, geoKeys } });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/v1/me/location/events
 * Create UserLocationEvent, update UserLocationProfile.
 */
export async function postLocationEvents(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = getAuthUserId(req as any);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const parsed = validateLocationEventBody(req.body);
    if (parsed.ok === false) {
      return res.status(400).json({ success: false, message: parsed.message });
    }
    const { eventId } = await createLocationEvent(prisma, userId, parsed.data);
    return res.status(201).json({ success: true, data: { eventId } });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/v1/me/location/manual
 * Upsert LocationPlace, set manualOverridePlaceId + currentPlaceId.
 */
export async function postLocationManual(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = getAuthUserId(req as any);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const parsed = validateLocationManualBody(req.body);
    if (parsed.ok === false) {
      return res.status(400).json({ success: false, message: parsed.message });
    }
    const { placeId } = await setManualLocation(prisma, userId, parsed.data);
    return res.status(201).json({ success: true, data: { placeId } });
  } catch (err) {
    return next(err);
  }
}

/**
 * PUT /api/v1/me/location
 * Set current user's saved place (Place shape). Creates Place if needed.
 */
export async function setLocation(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = getAuthUserId(req as any);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const body = req.body || {};
    const lat = Number(body.latitude);
    const lng = Number(body.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ success: false, message: "latitude and longitude are required" });
    }
    const newPlace = await prisma.place.create({
      data: {
        latitude: lat,
        longitude: lng,
        countryCode: body.countryCode ? String(body.countryCode).trim().slice(0, 2) : null,
        stateName: body.stateName ? String(body.stateName).slice(0, 255) : null,
        cityName: body.cityName ? String(body.cityName).slice(0, 255) : null,
        formattedAddress: body.formattedAddress ? String(body.formattedAddress).slice(0, 1024) : null,
      },
    });
    await prisma.user.update({
      where: { id: userId },
      data: { currentPlaceId: newPlace.id },
    });
    const updated = await prisma.place.findUnique({
      where: { id: newPlace.id },
      select: {
        latitude: true,
        longitude: true,
        countryCode: true,
        stateName: true,
        cityName: true,
        formattedAddress: true,
        updatedAt: true,
      },
    });
    return res.json({
      success: true,
      data: updated
        ? {
            latitude: updated.latitude,
            longitude: updated.longitude,
            countryCode: updated.countryCode ?? null,
            stateName: updated.stateName ?? null,
            cityName: updated.cityName ?? null,
            formattedAddress: updated.formattedAddress ?? null,
            updatedAt: updated.updatedAt,
          }
        : null,
    });
  } catch (err) {
    return next(err);
  }
}

export async function getContexts(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = getAuthUserId(req as any);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const userContextService = require("../../services/userContext.service");
    const contexts = await userContextService.listContexts(userId);
    return res.status(200).json({ success: true, data: contexts });
  } catch (e) {
    return next(e);
  }
}

export async function setDefaultContext(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = getAuthUserId(req as any);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const contextId = Number((req as any).params?.id);
    if (!Number.isFinite(contextId)) return res.status(400).json({ success: false, message: "Invalid context id" });
    const userContextService = require("../../services/userContext.service");
    const context = await userContextService.setDefaultContext(userId, contextId);
    return res.status(200).json({ success: true, data: context });
  } catch (e: any) {
    if (e?.message === "Context not found") return res.status(404).json({ success: false, message: e.message });
    return next(e);
  }
}

export default getMe;

// CommonJS compatibility for require("./me.controller")
(module as any).exports = {
  getMe,
  getNotifications,
  getLocation,
  setLocation,
  postLocationEvents,
  postLocationManual,
  getContexts,
  setDefaultContext,
};
