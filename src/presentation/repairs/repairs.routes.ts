import { Router } from "express";
import { RepairService } from "../services/repairs.service";
import { RepairController } from "./repairs.controllers";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { UsersService } from "../services/users.service";
import { envs } from "../../config";
import { EmailService } from "../services/email.service";

enum Role {
  CLIENT = "CLIENT",
  EMPLOYEE = "EMPLOYEE",
}

export class RepairsRoutes {
  static get routes(): Router {
    const router = Router();

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL
    );

    const userService = new UsersService(emailService);
    const repairService = new RepairService(userService);
    const controller = new RepairController(repairService);

    router.post("/", controller.createRepairAppointment);

    router.use(AuthMiddleware.protect);
    router.get(
      "/",
      AuthMiddleware.restricTo(Role.EMPLOYEE),
      controller.getRepairs
    );
    router.get("/:id", controller.getRepairById);
    router.patch("/:id", controller.updateRepairById);
    router.delete("/:id", controller.deleteRepairById);
    return router;
  }
}
