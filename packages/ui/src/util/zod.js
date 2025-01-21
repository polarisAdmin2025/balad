import { z } from 'zod'

export const applicantSchema = z
  .object({
    // ... existing applicant schema
  })

export const commericalSchema = z.object({
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
    .min(1, { message: 'This Field Is Required' })
    .refine(value => value.trim().length > 0, {
      message: 'This Field Is Required'
    }),
  StoreNum: z
    .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
    .min(1, { message: 'This Field Is Required' })
    .regex(/^\d+$/, {
      message: 'This field contain only numbers.'
    })
    .refine(value => value.trim().length > 0, {
      message: 'This Field Is Required'
    }),
  PropertyNum: z
    .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
    .min(1, { message: 'This Field Is Required' })
    .regex(/^\d+$/, {
      message: 'This field contain only numbers.'
    })
    .refine(value => value.trim().length > 0, {
      message: 'This Field Is Required'
    }),
  FloorsNum: z
    .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
    .min(1, { message: 'This Field Is Required' })
    .regex(/^\d+$/, {
      message: 'This field contain only numbers.'
    })
    .refine(value => value.trim().length > 0, {
      message: 'This Field Is Required'
    }),
  EntrancesNum: z
    .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
    .min(1, { message: 'This Field Is Required' })
    .regex(/^\d+$/, {
      message: 'This field contain only numbers.'
    })
    .refine(value => value.trim().length > 0, {
      message: 'This Field Is Required'
    }),
  StoreArea: z
    .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
    .min(1, { message: 'This Field Is Required' })
    .refine(value => value.trim().length > 0, {
      message: 'This Field Is Required'
    }),
  cancellationReason: z
    .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
    .min(1, { message: 'Please select a reason for cancellation' })
    .refine(value => ['01', '02', '03', '04'].includes(value), {
      message: 'Please select a valid reason'
    }),
  BoardDetails: z.array(
    z.object({
      BoardType: z
        .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
        .min(1, { message: 'This Field Is Required' }),
      BoardArea: z
        .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
        .min(1, { message: 'This Field Is Required' })
        .regex(/^\d+$/, {
          message: 'This field contain only numbers.'
        })
        .refine(value => value.trim().length > 0, {
          message: 'This Field Is Required'
        })
    })
  )
})

export const geoLocationSchema = z.object({
  // ... existing geoLocation schema
})

export const feesSchema = z.object({
  // ... existing fees schema
})