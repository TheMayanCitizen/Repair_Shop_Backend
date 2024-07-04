import { Router } from "express";
import { RepairService } from "../services/repairs.service";
import { RepairController } from "./repairs.controllers";
import { AuthMiddleware } from "../middlewares/auth.middleware";

enum Role {
  CLIENT = "CLIENT",
  EMPLOYEE = "EMPLOYEE",
}

export class RepairsRoutes {
  static get routes(): Router {
    const router = Router();

    const repairService = new RepairService();
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
