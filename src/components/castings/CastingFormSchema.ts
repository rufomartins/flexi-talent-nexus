import * as z from "zod";
import { CastingType } from "@/types/casting";

export const castingFormSchema = z.object({
  name: z.string().min(1, "Casting name is required"),
  type: z.enum(["internal", "external"]),
  status: z.enum(["open", "closed"]),
  client_id: z.string().optional(),
  project_manager_id: z.string().optional(),
  scout_id: z.string().optional(),
  logo_url: z.string().optional(),
  briefing: z.string().optional(),
  show_briefing_on_signup: z.boolean(),
  allow_talent_portal_apply: z.boolean(),
  description: z.string().optional(),
});

export type CastingFormData = z.infer<typeof castingFormSchema>;

export const defaultValues: CastingFormData = {
  name: "",
  type: "internal" as const,
  status: "open" as const,
  show_briefing_on_signup: false,
  allow_talent_portal_apply: true,
};