import { Users } from "../../data";
import { CustomError, UpdateUserDto } from "../../domain";
import { RegisterUserDto } from "../../domain/dtos/users/register-user.dto";

enum Status {
  ACTIVE = "ACTIVE",
  DISABLED = "DISABLED",
}

export class UsersService {
  constructor() {}

  async createUser(userData: RegisterUserDto) {
    const user = new Users();

    user.name = userData.name.toLowerCase().trim();
    user.email = userData.email.toLowerCase().trim();
    user.password = userData.password.trim();

    try {
      return await user.save();
    } catch (error: any) {
      throw CustomError.internalServer("Something very wrong my homeboy");
    }
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
