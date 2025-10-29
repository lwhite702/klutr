import { z } from "zod";

// Common validation schemas
export const NoteContentSchema = z.string().min(1).max(10000);
export const NoteTypeSchema = z.enum(["misc", "idea", "task", "contact", "link", "voice", "nope"]);
export const PasswordSchema = z.string().min(8).max(128);

// API Request schemas
export const CreateNoteSchema = z.object({
  content: NoteContentSchema,
  type: NoteTypeSchema.optional().default("misc"),
});

export const UpdateNoteSchema = z.object({
  id: z.string().uuid(),
  content: NoteContentSchema.optional(),
  type: NoteTypeSchema.optional(),
  archived: z.boolean().optional(),
});

export const CreateVaultNoteSchema = z.object({
  encryptedBlob: z.string().min(1),
  password: PasswordSchema,
});

export const ReclusterRequestSchema = z.object({
  force: z.boolean().optional().default(false),
});

export const GenerateInsightSchema = z.object({
  week: z.string().optional(),
});

// API Response schemas
export const NoteDTOSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
  type: NoteTypeSchema,
  archived: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  clusterUpdatedAt: z.string().nullable(),
});

export const ClusterSchema = z.object({
  name: z.string(),
  noteCount: z.number().int().min(0),
  summary: z.string(),
});

export const StackSchema = z.object({
  name: z.string(),
  noteCount: z.number().int().min(0),
  summary: z.string(),
  pinned: z.boolean(),
});

export const InsightSchema = z.object({
  week: z.string(),
  summary: z.string(),
  sentiment: z.enum(["positive", "neutral", "negative", "reflective"]),
});

export const VaultNoteSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string(),
});

// OpenAI API response schemas
export const OpenAIResponseSchema = z.object({
  choices: z.array(z.object({
    message: z.object({
      content: z.string(),
    }),
  })),
});

export const SmartStacksResponseSchema = z.object({
  stacks: z.array(StackSchema),
});

export const WeeklyInsightsResponseSchema = z.object({
  insights: z.array(InsightSchema),
});

// Rate limiting schemas
export const RateLimitSchema = z.object({
  limit: z.number().int().min(1),
  windowMs: z.number().int().min(1000),
  keyGenerator: z.function().optional(),
});

// Error response schema
export const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  code: z.string().optional(),
  timestamp: z.string(),
});

// Type exports
export type CreateNoteRequest = z.infer<typeof CreateNoteSchema>;
export type UpdateNoteRequest = z.infer<typeof UpdateNoteSchema>;
export type CreateVaultNoteRequest = z.infer<typeof CreateVaultNoteSchema>;
export type ReclusterRequest = z.infer<typeof ReclusterRequestSchema>;
export type GenerateInsightRequest = z.infer<typeof GenerateInsightSchema>;

export type NoteDTO = z.infer<typeof NoteDTOSchema>;
export type Cluster = z.infer<typeof ClusterSchema>;
export type Stack = z.infer<typeof StackSchema>;
export type Insight = z.infer<typeof InsightSchema>;
export type VaultNote = z.infer<typeof VaultNoteSchema>;

export type OpenAIResponse = z.infer<typeof OpenAIResponseSchema>;
export type SmartStacksResponse = z.infer<typeof SmartStacksResponseSchema>;
export type WeeklyInsightsResponse = z.infer<typeof WeeklyInsightsResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
