import { Router } from "express";
import { UsersService } from "../services/users.service";
import { UserController } from "./users.controllers";

export class UsersRoutes {
  static get routes(): Router {
    const router = Router();

    const userService = new UsersService();
    const controller = new UserController(userService);

    router.get("/", controller.getUsers);
    router.post("/", controller.createUser); //Necesita un DTo
    router.get("/:id", controller.getUserById);
    router.patch("/:id", controller.updateUserById); //Necesita un DTo
    router.delete("/:id", controller.deleteUserById);
    return router;
  }
}
