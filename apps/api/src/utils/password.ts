import bcryptjs from 'bcryptjs'

const SALT = 12

export const hashPassword = (password: string) => {
  return bcryptjs.hash(password, SALT)
}

export const comparePassword = (userPassword: string, hashedPassword: string) => {
  return bcryptjs.compare(userPassword, hashedPassword)
}
