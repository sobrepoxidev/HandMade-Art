export type CheckoutErrorCode =
  | "discount_exhausted"
  | "out_of_stock"
  | "payment_failed"
  | "unauthorized";

const DEFAULT_STATUS_BY_CODE: Record<CheckoutErrorCode, number> = {
  discount_exhausted: 409,
  out_of_stock: 409,
  payment_failed: 402,
  unauthorized: 403,
};

export class CheckoutError extends Error {
  readonly code: CheckoutErrorCode;
  readonly status: number;

  constructor(code: CheckoutErrorCode, message: string, status = DEFAULT_STATUS_BY_CODE[code]) {
    super(message);
    this.name = "CheckoutError";
    this.code = code;
    this.status = status;
  }
}

export function getCheckoutErrorPayload(error: unknown, fallbackMessage: string) {
  if (error instanceof CheckoutError) {
    return {
      body: { error: error.message, code: error.code },
      status: error.status,
    };
  }

  return {
    body: { error: error instanceof Error ? error.message : fallbackMessage },
    status: 400,
  };
}

export function isOutOfStockDatabaseError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeError = error as { message?: string; details?: string; code?: string };
  return (
    maybeError.message?.includes("OUT_OF_STOCK")
    || maybeError.details?.includes("OUT_OF_STOCK")
    || maybeError.code === "P0001"
  );
}
