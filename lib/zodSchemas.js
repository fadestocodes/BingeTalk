import { z } from 'zod'

export const signupSchema = z.object({
    email : z.string().email({message : 'Must be a valid email address'}),
    password : z.string()
    .min(8, {message:'Must be at least 8 characters long'})
    .regex(/[A-Z]/, { message : 'Password must have at least 1 uppercase letter' })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message : 'Password must have at least 1 special character' }),
    confirmPassword : z.string()
}).refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ['confirmPassword'], // Point the error to confirmPassword field
      message: 'Passwords must match',
    }
  );

  export const signupPasswordSchema = z.object({
    password : z.string()
    .min(8, {message:'Must be at least 8 characters long'})
    .regex(/[A-Z]/, { message : 'Password must have at least 1 uppercase letter' })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message : 'Password must have at least 1 special character' }),
  })

  export const signupEmailSchema = z.object({
    email : z.string().email({message : 'Must be a valid email address'}),
  })

  export const signupConfirmPasswordSchema = ( password ) => z.object({
    confirmPassword : z.string()
  }).refine(
    (data) =>  data.confirmPassword === password,
    {
      path: ['confirmPassword'], // Point the error to confirmPassword field
      message: 'Passwords must match',
    }
  );

  export const signupNameSchema = z.object({
    firstName: z.string()
    .min(2, { message: 'First name must be at least 2 characters' })
    .max(20, { message: 'First name must be less than 20 characters' })
    .regex(/^[a-zA-Z\s'-]+$/, { message: 'First name can only contain letters, spaces, apostrophes, and hyphens' }),
    lastName: z.string()
    .min(2, { message: 'Last name must be at least 2 characters' })
    .max(20, { message: 'Last name must be less than 20 characters' })
    .regex(/^[a-zA-Z\s'-]+$/, { message: 'Last name can only contain letters, spaces, apostrophes, and hyphens' }),
  })

  export const usernameSchema = z.object({
    username : z.string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(15, { message: 'Username must be 15 characters or fewer' })
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9_]*$/, { 
      message: 'Username can only contain letters, numbers, and underscores, and cannot start with an underscore'})
  })

  export const createDialogueSchema = z.object({
    content : z.string()
    .min(3, {message : 'Dialogue post must be at least 3 characters long'})
  })

  export const createThreadSchema = z.object({
    threadTitle: z.string()
    .min(5, {message : 'Thread title must be at least 5 characters long'})
  })

  export const createListSchema = z.object({
    listTitle : z.string()
    .min(5,{message : 'List title must be at least 5 characters long'})
  })