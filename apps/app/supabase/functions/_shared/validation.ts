// Shared validation utilities for Edge Functions

export interface ValidationError {
  field: string;
  message: string;
}

export function validateContent(content: unknown): { valid: true; data: string } | { valid: false; errors: ValidationError[] } {
  if (typeof content !== 'string') {
    return {
      valid: false,
      errors: [{ field: 'content', message: 'Content must be a string' }],
    };
  }

  if (content.trim().length === 0) {
    return {
      valid: false,
      errors: [{ field: 'content', message: 'Content cannot be empty' }],
    };
  }

  // Limit content length to prevent abuse
  const MAX_CONTENT_LENGTH = 50000; // 50KB
  if (content.length > MAX_CONTENT_LENGTH) {
    return {
      valid: false,
      errors: [{ field: 'content', message: `Content exceeds maximum length of ${MAX_CONTENT_LENGTH} characters` }],
    };
  }

  return { valid: true, data: content.trim() };
}

export function validateUserId(userId: unknown): { valid: true; data: string } | { valid: false; errors: ValidationError[] } {
  if (typeof userId !== 'string') {
    return {
      valid: false,
      errors: [{ field: 'userId', message: 'userId must be a string' }],
    };
  }

  // Basic format validation (CUID or UUID)
  const isValidFormat = /^[a-zA-Z0-9_-]{20,}$/.test(userId);
  if (!isValidFormat) {
    return {
      valid: false,
      errors: [{ field: 'userId', message: 'userId has invalid format' }],
    };
  }

  return { valid: true, data: userId };
}

export function validateEmbedNotePayload(body: unknown): { valid: true; data: { content: string } } | { valid: false; errors: ValidationError[] } {
  if (typeof body !== 'object' || body === null) {
    return {
      valid: false,
      errors: [{ field: 'body', message: 'Request body must be an object' }],
    };
  }

  const contentValidation = validateContent((body as any).content);
  if (!contentValidation.valid) {
    return contentValidation;
  }

  return { valid: true, data: { content: contentValidation.data } };
}

export function validateClassifyNotePayload(body: unknown): { valid: true; data: { content: string } } | { valid: false; errors: ValidationError[] } {
  if (typeof body !== 'object' || body === null) {
    return {
      valid: false,
      errors: [{ field: 'body', message: 'Request body must be an object' }],
    };
  }

  const contentValidation = validateContent((body as any).content);
  if (!contentValidation.valid) {
    return contentValidation;
  }

  return { valid: true, data: { content: contentValidation.data } };
}

export function validateUserIdPayload(body: unknown): { valid: true; data: { userId: string } } | { valid: false; errors: ValidationError[] } {
  if (typeof body !== 'object' || body === null) {
    return {
      valid: false,
      errors: [{ field: 'body', message: 'Request body must be an object' }],
    };
  }

  const userIdValidation = validateUserId((body as any).userId);
  if (!userIdValidation.valid) {
    return userIdValidation;
  }

  return { valid: true, data: { userId: userIdValidation.data } };
}

