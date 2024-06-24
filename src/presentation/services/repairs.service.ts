import { Repairs } from "../../data";
import { CreateRepairDto, CustomError, UpdateRepairDto } from "../../domain";

enum Status {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export class RepairService {
  constructor() {}

  async createRepairAppointment(appointmentData: CreateRepairDto) {
    const repair = new Repairs();

    repair.date = appointmentData.date;
    repair.userId = appointmentData.userId;

    try {
      return await repair.save();
    } catch (error) {
      throw CustomError.internalServer("Something went wrong ese");
    }
  }

  async getAllPendingRepairs() {
    try {
      return await Repairs.find({
        where: {
          status: Status.PENDING,
        },
      });
    } catch (error) {
      throw CustomError.internalServer("Something went wrong ese");
    }
  }

  async getPendingRepairById(id: number) {
    const repair = await Repairs.findOne({
      where: {
        id,
        status: Status.PENDING,
      },
    });

    if (!repair) {
      throw CustomError.notFound(`Repair with id ${id} was not found`);
    }

    return repair;
  }

  async updateRepairStatus(appointmentData: UpdateRepairDto, id: number) {
    const repair = await this.getPendingRepairById(id);

    repair.status = appointmentData.status;

    try {
      return await repair.save();
    } catch (error) {
      throw CustomError.internalServer("Something very wrong my homeboy");
    }
  }

  async deleteRepairById(id: number) {
    const repair = await this.getPendingRepairById(id);

    repair.status = Status.CANCELLED;

    try {
      await repair.save();
      return;
    } catch (error) {
      throw CustomError.internalServer("Something very wrong my homeboy");
    }
  }
}
