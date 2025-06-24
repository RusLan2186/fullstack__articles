import { body } from 'express-validator'

export const registerValidation = [
  body('email', 'wrong email').isEmail(),
  body('password', 'password must be at least 5 symbols').isLength({ min: 5 }),
  body('fullName', 'fullName must be at least 2 symbols').isLength({ min: 2, max: 30 }),
  body('avatarUrl', 'wrong avatar url').optional().isURL()
]

export const loginValidation = [
  body('email', 'wrong email').isEmail(),
  body('password', 'password must be at least 5 symbols').isLength({ min: 5 }),
]

export const postCreateValidation = [
  body('title', 'title must be at least 3 symbols').isLength({ min: 3 }).isString(),
  body('text', 'text must be at least 10 symbols').isLength({ min: 10 }).isString(),
  body('tags', 'Wrong tags format').optional().isArray(),
  body('imageUrl', 'Wrong image link').optional().isString(),
]


export const commentCreateValidation = [
  body('text', 'text must be at least 5 symbols').isLength({ min: 5 }).isString(),
]
