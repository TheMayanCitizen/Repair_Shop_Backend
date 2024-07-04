import { Request, Response } from "express";
import { UsersService } from "../services/users.service";
import { CustomError, RegisterUserDto, UpdateUserDto } from "../../domain";
import { LoginUserDto } from "../../domain/dtos/users/login-user.dto";

export class UserController {
  constructor(public readonly userService: UsersService) {}

  private handleError = (error: unknown, res: Response) => {
    console.log(error);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Something went wrong!" });
  };

  getUsers = (req: Request, res: Response) => {
    this.userService
      .getAllUsers()
      .then((users) => res.status(200).json(users))
      .catch((error: unknown) => this.handleError(error, res));
  };

  getUserById = (req: Request, res: Response) => {
    const { id } = req.params;

    if (isNaN(+id)) {
      return res.status(400).json({ message: "Id must be a valid number" });
    }

    this.userService
      .getUserById(+id)
      .then((user) => res.status(200).json(user))
      .catch((error: unknown) => this.handleError(error, res));
  };

  updateUserById = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, updateUserDto] = UpdateUserDto.updateUser(req.body);

    if (isNaN(+id)) {
      return res.status(400).json({ message: "Id must be a number" });
    }

    if (error) return res.status(422).json({ message: error });

    this.userService
      .updateUserById(updateUserDto!, +id)
      .then((user) => res.status(200).json(user))
      .catch((error: unknown) => this.handleError(error, res));
  };

  deleteUserById = (req: Request, res: Response) => {
    const { id } = req.params;
    if (isNaN(+id)) {
      return res.status(400).json({ message: "Id must be a number" });
    }

    this.userService
      .deleteUserById(+id)
      .then(() => res.status(204).json())
      .catch((error: unknown) => this.handleError(error, res));
  };

  //SINGLE USER CONTROLLERS
  createUser = (req: Request, res: Response) => {
    const [error, createUserDto] = RegisterUserDto.create(req.body);
    if (error) return res.status(422).json({ message: error });

    this.userService
      .createUser(createUserDto!)
      .then((user) => res.status(200).json(user))
      .catch((error: unknown) => this.handleError(error, res));
  };

  validateEmail = async (req: Request, res: Response) => {
    const { token } = req.params;

    this.userService
      .validateEmail(token)
      .then(() => res.json("Email was validated propely"))
      .catch((error) => this.handleError(error, res));
  };

  login = async (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);

    if (error) return res.status(400).json({ message: error });

    this.userService
      .login(loginUserDto!)
      .then((data) => res.status(200).json(data))
      .catch((error) => this.handleError(error, res));
  };

  getProfile = (req: Request, res: Response) => {
    const { id } = req.body.sessionUser;

    this.userService
      .getProfile(+id)
      .then((data) => res.status(200).json(data))
      .catch((error) => this.handleError(error, res));
  };
}
