import { Router } from "express";
import { RepairsRoutes } from "./repairs/repairs.routes";
import { UsersRoutes } from "./users/users.routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use("/api/v1/users", UsersRoutes.routes);
    router.use("/api/v1/repair", RepairsRoutes.routes);

    return router;
  }
}
