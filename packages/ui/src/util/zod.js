import { z } from 'zod'

export const applicantSchema = z
  .object({
    ApplicantType: z
      .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
      .min(1, { message: 'This Field Is Required' }),
    OnBehalf: z
      .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
      .optional(),
    RegInfo: z.object({
      commercial_record: z
        .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
        .optional()
    })
  })
  .refine(
    data => {
      // Skip validation if ApplicantType is "Owner"
      if (data.ApplicantType === '01') {
        return true
      }
      // Validate OnBehalf only if ApplicantType is "Commissioner"
      if (data.ApplicantType === '02') {
        return data.OnBehalf && data.OnBehalf.trim() !== ''
      }
      return true
    },
    {
      message: 'This Field Is Required',
      path: ['OnBehalf']
    }
  )
  .refine(
    data => {
      // Validate RegInfo only if OnBehalf is valid (not skipped or invalid)
      if (
        (data.ApplicantType === '02' &&
          data.OnBehalf &&
          data.OnBehalf.trim() !== '') ||
        data.ApplicantType === '01'
      ) {
        return (
          data.RegInfo &&
          data.RegInfo.commercial_record &&
          data.RegInfo.commercial_record.trim() !== ''
        )
      }
      return true
    },
    {
      message: 'This Field Is Required',
      path: ['RegInfo']
    }
  )

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
  City: z
    .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
    .min(1, { message: 'This Field Is Required' })
    .refine(value => value !== '--Select City--' && value !== '', {
      message: 'Please select a valid city'
    }),
  region: z
    .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
    .min(1, { message: 'This Field Is Required' })
    .refine(value => value !== '--Select Area--' && value !== '', {
      message: 'Please select a valid city'
    }),
  neighborhood: z
    .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
    .min(1, { message: 'This Field Is Required' })
    .refine(value => value !== '--Select District--' && value !== '', {
      message: 'Please select a valid city'
    }),
  Street: z
    .string({ errorMap: () => ({ message: 'This Field Is Required' }) })
    .min(1, { message: 'This Field Is Required' })
    .refine(value => value.trim().length > 0, {
      message: 'This Field Is Required'
    })
})

export const feesSchema = z.object({
  phone: z
    .string({ required_error: 'Phone number is required' })
    .min(1, { message: 'Phone number is required' })
    .regex(/^\+962[7-9][0-9]{8}$/, {
      message: 'Phone number must start with +962 followed by 9 digits'
    }),
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' })
})