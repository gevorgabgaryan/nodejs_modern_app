import UserService from './UserService';
import jwt from 'jsonwebtoken';
import Config from '../config/'


UserService;
class AuthService {
  static async registerService(email, password, firstName, lastName) {
    const existingEmail = await UserService.findByEmail(email);
    if (existingEmail) {
      return {
        message: "The given email already exists",
      };
    }

    const newUser = await UserService.addUser(
      email,
      password,
      firstName,
      lastName
    );
    return {
      id: newUser._id,
      message: "Account was created",
    };
  }

  static async loginService(email, password) {
    const user = await UserService.findByEmail(email);
    if (!user) {
      return {
        message: "invalid credentials",
      };
    }

    const isMatched = user.comparePassword(password);

    if (!isMatched) {
      return {
        message: "invalid credentials",
      };
    }
    const token = jwt.sign({
        userId: user._id
    }, Config.JWTSECRET, {
        expiresIn: '2d'
    })

    return {jwt: token}
  }
}

export default AuthService;
