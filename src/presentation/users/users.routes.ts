import { Router } from "express";
import { UsersService } from "../services/users.service";
import { UserController } from "./users.controllers";
import { EmailService } from "../services/email.service";
import { envs } from "../../config";

export class UsersRoutes {
  static get routes(): Router {
    const router = Router();

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL
    );
    const userService = new UsersService(emailService);
    const controller = new UserController(userService);

    // Single user's routes
    router.post("/register", controller.createUser); //Necesita un DTo
    router.get("/validate-email/:token", controller.validateEmail);
    router.post("/login", controller.login);
    // Other routes
    router.get("/", controller.getUsers);
    router.get("/:id", controller.getUserById);
    router.patch("/:id", controller.updateUserById); //Necesita un DTo
    router.delete("/:id", controller.deleteUserById);

    return router;
  }
}
