import { Router } from "express";
import { RepairService } from "../services/repairs.service";
import { RepairController } from "./repairs.controllers";

export class RepairsRoutes {
  static get routes(): Router {
    const router = Router();

    const repairService = new RepairService();
    const controller = new RepairController(repairService);

    router.get("/", controller.getRepairs);
    router.post("/", controller.createRepairAppointment);
    router.get("/:id", controller.getRepairById);
    router.patch("/:id", controller.updateRepairById);
    router.delete("/:id", controller.deleteRepairById);
    return router;
  }
}
