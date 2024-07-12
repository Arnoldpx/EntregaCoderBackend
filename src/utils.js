import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
import bcrypt from 'bcryptjs'

export default __dirname

export const crateHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10))

export const isValidPassword = (userPassword, inputPassword) => {
    if (!userPassword || !inputPassword) {
      throw new Error('Password values cannot be undefined');
    }
    return bcrypt.compareSync(inputPassword, userPassword);
  };