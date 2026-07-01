import type { NextFunction, Request, Response } from "express";

/**
 * 404 handler
 */
function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  // #region agent log
  if ((req.originalUrl || "").includes("catalog/import")) {
    fetch("http://127.0.0.1:7242/ingest/8587e4aa-5cb6-4181-b813-5bca1da63be3", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "7204b9" },
      body: JSON.stringify({
        sessionId: "7204b9",
        hypothesisId: "A",
        location: "errors.ts:notFoundHandler",
        message: "404 sent for catalog/import",
        data: { method: req.method, originalUrl: req.originalUrl, path: req.path, baseUrl: req.baseUrl },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }
  // #endregion
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

/**
 * Fallback when a route uses raw multer without the profile wrapper.
 */
function fallbackMulterMessage(err: any): { status: number; message: string; code: string; meta?: { maxSizeMb: number } } | null {
  const code = err?.code;
  const name = err?.name;
  const isMulter =
    name === "MulterError" || (typeof code === "string" && String(code).startsWith("LIMIT_"));
  if (!isMulter) return null;
  if (code === "LIMIT_FILE_SIZE") {
    const maxSizeMb = Math.round(
      Number(process.env.MAX_UPLOAD_BYTES || 200 * 1024 * 1024) / (1024 * 1024)
    );
    return {
      status: 413,
      message: `Uploaded file is too large. Maximum allowed size is ${maxSizeMb}MB.`,
      code: "FILE_TOO_LARGE",
      meta: { maxSizeMb },
    };
  }
  if (
    code === "LIMIT_UNEXPECTED_FILE" ||
    code === "LIMIT_FILE_COUNT" ||
    code === "LIMIT_PART_COUNT" ||
    code === "LIMIT_FIELD_KEY"
  ) {
    return {
      status: 400,
      message: "Invalid upload request. Send a single file using the expected field name.",
      code: "INVALID_MULTIPART_PAYLOAD",
    };
  }
  return {
    status: 400,
    message: "Could not process the uploaded file. Please try again.",
    code: "INVALID_MULTIPART_PAYLOAD",
  };
}

/**
 * Global error handler (supports ApiError-style { statusCode, details } and plain Error)
 */
function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  const e = err as any;

  const multerFallback = fallbackMulterMessage(e);
  if (multerFallback) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    const payload: any = {
      success: false,
      message: multerFallback.message,
      code: multerFallback.code,
    };
    if (multerFallback.meta) payload.meta = multerFallback.meta;
    return res.status(multerFallback.status).json(payload);
  }

  const status: number = Number(e?.statusCode || e?.status || 500);

  // Always log the full error server-side
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  // Never expose raw error messages (stack traces, module paths, etc.) for 500 errors
  let message: string;
  if (status >= 500) {
    message = "Something went wrong. Please try again.";
  } else {
    message = String(e?.message || "Something went wrong. Please try again.");
  }

  const payload: any = { success: false, message };
  if (typeof e?.code === "string" && e.code.length > 0) payload.code = e.code;
  if (e?.meta !== undefined) payload.meta = e.meta;

  // Include details object only for non-500 errors
  if (status < 500 && e?.details !== undefined) payload.details = e.details;

  res.status(status).json(payload);
}

module.exports = { notFoundHandler, errorHandler };
