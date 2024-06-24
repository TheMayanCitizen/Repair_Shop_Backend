import { Request, Response } from "express";
import { RepairService } from "../services/repairs.service";
import { CreateRepairDto, CustomError, UpdateRepairDto } from "../../domain";

export class RepairController {
  constructor(public readonly repairService: RepairService) {}

  private handleError = (error: unknown, res: Response) => {
    console.log(error);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Something went wrong!" });
  };

  getRepairs = (req: Request, res: Response) => {
    this.repairService
      .getAllPendingRepairs()
      .then((repairs) => res.status(200).json(repairs))
      .catch((error: unknown) => this.handleError(error, res));
  };

  getRepairById = (req: Request, res: Response) => {
    const { id } = req.params;

    if (isNaN(+id)) {
      return res.status(400).json({ message: "Id must be a valid number" });
    }

    this.repairService
      .getPendingRepairById(+id)
      .then((repair) => res.status(200).json(repair))
      .catch((error: unknown) => this.handleError(error, res));
  };

  createRepairAppointment = (req: Request, res: Response) => {
    const [error, createRepairDto] = CreateRepairDto.create(req.body);
    if (error) return res.status(422).json({ message: error });

    this.repairService
      .createRepairAppointment(createRepairDto!)
      .then((repair) => res.status(200).json(repair))
      .catch((error: unknown) => this.handleError(error, res));
  };

  updateRepairById = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, updateRepairDto] = UpdateRepairDto.updateRepair(req.body);

    if (isNaN(+id)) {
      return res.status(400).json({ message: "Id must be a valid number" });
    }

    if (error) return res.status(422).json({ message: error });

    this.repairService
      .updateRepairStatus(updateRepairDto!, +id)
      .then((repair) => res.status(200).json(repair))
      .catch((error: unknown) => this.handleError(error, res));
  };

  deleteRepairById = (req: Request, res: Response) => {
    const { id } = req.params;
    if (isNaN(+id)) {
      return res.status(400).json({ message: "Id must be a valid number" });
    }

    this.repairService
      .deleteRepairById(+id)
      .then(() => res.status(204).json())
      .catch((error: unknown) => this.handleError(error, res));
  };
}
