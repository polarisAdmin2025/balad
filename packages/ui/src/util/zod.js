import { z } from 'zod'

// Base schema for common fields
const baseCommercialSchema = z.object({
  StoreName: z.string().optional(),
  StoreNum: z.string().optional(),
  PropertyNum: z.string().optional(),
  FloorsNum: z.string().optional(),
  EntrancesNum: z.string().optional(),
  StoreArea: z.string().optional()
})

// Schema for ICL (Issue Commercial License) commercial activity
export const iclCommercialSchema = baseCommercialSchema.extend({
  MainCommerical: z
    .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
    .min(1, { message: 'This Field Is Required' }),
  SubActivity: z
    .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
    .min(1, { message: 'This Field Is Required' }),
  AdditionalActivity: z
    .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
    .min(1, { message: 'This Field Is Required' }),
  StoreName: z
    .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
    .min(1, { message: 'This Field Is Required' }),
  StoreNum: z
    .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
    .min(1, { message: 'This Field Is Required' }),
  PropertyNum: z
    .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
    .min(1, { message: 'This Field Is Required' }),
  FloorsNum: z
    .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
    .min(1, { message: 'This Field Is Required' }),
  EntrancesNum: z
    .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
    .min(1, { message: 'This Field Is Required' }),
  StoreArea: z
    .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
    .min(1, { message: 'This Field Is Required' }),
  BoardDetails: z
    .array(
      z.object({
        BoardType: z
          .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
          .min(1, { message: 'This Field Is Required' }),
        BoardArea: z
          .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
          .min(1, { message: 'This Field Is Required' })
      })
    )
    .optional()
})

// Schema for CCL (Cancel Commercial License) commercial activity
export const cclCommercialSchema = baseCommercialSchema.extend({
  cancellationReason: z
    .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
    .min(1, { message: 'Please select a cancellation reason' })
})

// Schema for CCL applicant validation
export const cclApplicantSchema = z.discriminatedUnion('ApplicantType', [
  // For ApplicantType "01" (Owner)
  z.object({
    ApplicantType: z.literal('01'),
    RegInfo: z.object({
      commercial_record: z.string().optional(),
      Valid: z.boolean().optional(),
      Show: z.boolean().optional()
    }),
    selectedStores: z
      .array(z.string())
      .min(1, { message: 'Please select at least one store' })
  }),
  
  // For ApplicantType "02" (Commissioner)
  z.object({
    ApplicantType: z.literal('02'),
    OnBehalf: z
      .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
      .min(1, { message: 'This Field Is Required' }),
    RegInfo: z.object({
      commercial_record: z
        .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
        .min(1, { message: 'This Field Is Required' }),
      Valid: z.boolean().optional(),
      Show: z.boolean().optional()
    }),
    selectedStores: z
      .array(z.string())
      .min(1, { message: 'Please select at least one store' })
  })
])

// Schema for ICL applicant validation
export const iclApplicantSchema = z.object({
  ApplicantType: z
    .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
    .min(1, { message: 'This Field Is Required' }),
  OnBehalf: z
    .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
    .optional(),
  RegInfo: z.object({
    commercial_record: z
      .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
      .min(1, { message: 'This Field Is Required' }),
    Valid: z.boolean().optional(),
    Show: z.boolean().optional()
  }),
  selectedStores: z
    .array(z.string())
    .optional()
}).superRefine((data, ctx) => {
  // For ApplicantType "Commissioner" (02)
  if (data.ApplicantType === '02' && !data.OnBehalf) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'This Field Is Required',
      path: ['OnBehalf']
    })
  }
})

export const geoLocationSchema = z.object({
  City: z
    .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
    .min(1, { message: 'This Field Is Required' }),
  region: z
    .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
    .min(1, { message: 'This Field Is Required' }),
  neighborhood: z
    .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
    .min(1, { message: 'This Field Is Required' }),
  Street: z
    .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
    .min(1, { message: 'This Field Is Required' }),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number()
    })
    .nullable()
    .refine(val => val !== null, {
      message: 'Please select a location on the map'
    })
})

export const feesSchema = z.object({
  phone: z
    .string()
    .regex(/^\+962[0-9]{9}$/, {
      message: 'Phone number must start with +962 followed by 9 digits'
    }),
  email: z
    .string()
    .email({ message: 'Invalid email address' })
})