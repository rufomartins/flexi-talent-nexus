import * as z from "zod";

export const castingFormSchema = z.object({
  name: z.string().min(1, "Casting name is required"),
  type: z.enum(["internal", "external"]),
  casting_type: z.enum(["internal", "external"]),
  status: z.enum(["open", "closed"]),
  client_id: z.string().optional().nullable(),
  project_manager_id: z.string().optional().nullable(),
  scout_id: z.string().optional().nullable(),
  logo_url: z.string().optional().nullable(),
  briefing: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  show_briefing: z.boolean().default(false),
  allow_talent_portal: z.boolean().default(false),
  allow_talent_portal_apply: z.boolean().default(true)
});

export type CastingFormData = z.infer<typeof castingFormSchema>;

export const defaultValues: Partial<CastingFormData> = {
  type: "internal",
  casting_type: "internal",
  status: "open",
  show_briefing: false,
  allow_talent_portal: false,
  allow_talent_portal_apply: true,
  briefing: "",
  description: ""
};