import {
  JwtAdapter,
  bcryptAdapter,
  createHTMLValdationEmailTemplate,
  envs,
} from "../../config";
import { Users } from "../../data";
import { CustomError, UpdateUserDto } from "../../domain";
import { LoginUserDto } from "../../domain/dtos/users/login-user.dto";
import { RegisterUserDto } from "../../domain/dtos/users/register-user.dto";
import { EmailService } from "./email.service";

enum Status {
  ACTIVE = "ACTIVE",
  DISABLED = "DISABLED",
}

export class UsersService {
  constructor(private readonly emailService: EmailService) {}

  async createUser(userData: RegisterUserDto) {
    const userExists = await Users.findOne({
      where: {
        status: Status.ACTIVE,
        email: userData.email,
      },
    });

    if (userExists) throw CustomError.badRequest("Email already exists");

    const user = new Users();

    user.name = userData.name.toLowerCase().trim();
    user.email = userData.email.toLowerCase().trim();
    user.password = userData.password.trim();

    try {
      await user.save();
      await this.sendEmailValidationLink(user.email);
      const token = await JwtAdapter.generateToken({ id: user.id });
      if (!token) throw CustomError.internalServer("Error while creating jwt");
      return user;
    } catch (error: any) {
      throw CustomError.internalServer("Something very wrong my homeboy");
    }
  }

  public sendEmailValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email });
    if (!token)
      throw CustomError.internalServer(
        "Ups We could not get a token for you my homeboy"
      );

    const link = `${envs.WEBSERVICE_URL}/user/validate-email/${token}`;

    // const html = `
    // <h1>Validate your email</h1>
    // <p> Click on the following link to validate your email</p>
    // <a href="${link}"> Validate your email: ${email}
    // `;

    const html = createHTMLValdationEmailTemplate(link, email);

    const isEmailSent = this.emailService.sendEmail({
      to: email,
      subject: "Just one more step",
      htmlBody: html,
    });

    if (!isEmailSent) throw CustomError.internalServer("Error sending email");

    return true;
  };

  public validateEmail = async (token: string) => {
    const payload = await JwtAdapter.validateToken(token);
    if (!payload) throw CustomError.unAuthorized("Invalid Token");

    const { email } = payload as { email: string };

    if (!email) throw CustomError.internalServer("Email not in token");

    const user = await Users.findOne({ where: { email } });

    if (!user) throw CustomError.internalServer("Email does not exist");

    user.emailValidated = true;

    try {
      await user.save();
    } catch (error) {
      throw CustomError.internalServer("Something went wrong hommie");
    }
  };

  async login(loginUserDto: LoginUserDto) {
    //1.Buscar el usuari que se quiere loggear
    const user = await Users.findOne({
      where: {
        email: loginUserDto.email,
        status: Status.ACTIVE,
        emailValidated: true,
      },
    });

    if (!user) throw CustomError.unAuthorized("Invalid email or password");

    //2. Validar si la contrasena es correcta
    const isMatching = bcryptAdapter.compare(
      loginUserDto.password,
      user.password
    );

    if (!isMatching)
      throw CustomError.unAuthorized("Invalid email or password");

    //3.Generar token
    const token = await JwtAdapter.generateToken({ id: user.id });

    if (!token) throw CustomError.internalServer("Error while creating JWT");

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

      //4.Enviar informacion al cliente
    };
  }

  async getProfile(id: number) {
    const user = await Users.findOne({
      where: {
        id,
        status: Status.ACTIVE,
      },
    });

    if (!user) throw CustomError.notFound("User not found");

    return user;
  }

  async getAllUsers() {
    try {
      return await Users.find({
        where: {
          status: Status.ACTIVE,
        },
      });
    } catch (error) {
      throw CustomError.internalServer("Something very wrong my homeboy");
    }
  }

  async getUserById(id: number) {
    const user = await Users.findOne({
      where: {
        id,
        status: Status.ACTIVE,
      },
    });

    if (!user) {
      throw CustomError.notFound(`User with id ${id} was not found`);
    }

    return user;
  }

  async updateUserById(userData: UpdateUserDto, id: number) {
    const user = await this.getUserById(id);

    user.name = userData.name.toLocaleLowerCase().trim();
    user.email = userData.email;

    try {
      return await user.save();
    } catch (error) {
      throw CustomError.internalServer("Something very wrong my homeboy");
    }
  }

  async deleteUserById(id: number) {
    const user = await this.getUserById(id);

    user.status = Status.DISABLED;

    try {
      await user.save();
      return;
    } catch (error) {
      throw CustomError.internalServer("Something very wrong my homeboy");
    }
  }
}
