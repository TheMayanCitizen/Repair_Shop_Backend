import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Users } from "./user.model";

enum Status {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

@Entity()
export class Repairs extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    nullable: false,
    type: "date",
  })
  date: Date;

  @Column({
    nullable: false,
    type: "integer",
  })
  motorsNumber: number;

  @Column({
    nullable: false,
    type: "text",
  })
  description: string;

  @Column({
    nullable: false,
    type: "enum",
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @ManyToOne(() => Users, (user) => user.repairs)
  user: Users;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
