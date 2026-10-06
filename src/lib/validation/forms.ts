import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2).max(120),
  company: z.string().min(1).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional(),
  collaborationType: z.string().min(1).max(120),
  budget: z.string().max(80).optional(),
  message: z.string().min(10).max(5000),
  locale: z.enum(["en", "fr"]),
  website: z.string().max(0).optional(),
});

export const registrationFormSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().min(5).max(40),
  country: z.string().min(2).max(80),
  trainingId: z.string().optional(),
  trainingSlug: z.string().min(1),
  trainingName: z
    .object({ en: z.string(), fr: z.string() })
    .optional(),
  preferredDate: z.string().max(40).optional(),
  participants: z.coerce.number().int().min(1).max(50),
  experienceLevel: z.string().min(1).max(80),
  message: z.string().max(5000).optional(),
  locale: z.enum(["en", "fr"]),
  website: z.string().max(0).optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type RegistrationFormInput = z.infer<typeof registrationFormSchema>;
