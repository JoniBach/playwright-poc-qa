/**
 * Shared validation schemas for testing
 * These can be used across API, UI, and E2E tests
 */

import { z } from 'zod';

/**
 * Email validation schema
 */
export const emailSchema = z.string().email();

/**
 * UK phone number schema
 */
export const phoneSchema = z.string().regex(/^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/);

/**
 * Reference number schema (APP-TIMESTAMP-RANDOM format)
 * Format: APP-{base36timestamp}-{base36random}
 * Base36 uses 0-9 and A-Z characters
 */
export const referenceNumberSchema = z.string().regex(/^APP-[A-Z0-9]+-[A-Z0-9]+$/);

/**
 * Validation error response schema
 */
export const validationErrorResponseSchema = z.object({
  success: z.literal(false),
  errors: z.record(z.string(), z.string()),
  message: z.string().optional()
});

/**
 * Success response schema
 */
export const successResponseSchema = z.object({
  success: z.literal(true),
  complete: z.boolean().optional(),
  referenceNumber: z.string().optional(),
  nextPage: z.string().optional(),
  currentPage: z.string().optional()
});

/**
 * Generic submission response schema
 */
export const submissionResponseSchema = z.union([
  successResponseSchema,
  validationErrorResponseSchema
]);

/**
 * Helicopter registration data schema
 */
export const helicopterDataSchema = z.object({
  helicopterMake: z.string().min(1),
  helicopterModel: z.string().min(1),
  helicopterSerial: z.string().min(1),
  ownerFullName: z.string().min(1),
  ownerEmail: emailSchema,
  ownerPhone: phoneSchema
});

/**
 * Plane registration data schema
 */
export const planeDataSchema = z.object({
  'aircraft-manufacturer': z.string().min(1),
  'aircraft-model': z.string().min(1),
  'aircraft-serial': z.string().min(1),
  'applicant-type': z.enum(['individual', 'organisation']),
  'email-address': emailSchema,
  'telephone-number': phoneSchema
});

/**
 * Validate that an object matches a schema
 */
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): { valid: boolean; errors?: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { valid: true };
  }
  return { valid: false, errors: result.error };
}

/**
 * Assert that data matches schema (throws if invalid)
 */
export function assertSchema<T>(schema: z.ZodSchema<T>, data: unknown, message?: string): asserts data is T {
  const result = validateSchema(schema, data);
  if (!result.valid) {
    throw new Error(message || `Schema validation failed: ${result.errors?.message}`);
  }
}
