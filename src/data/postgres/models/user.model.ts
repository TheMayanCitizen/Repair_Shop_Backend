import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { bcryptAdapter } from "../../../config";
import { Repairs } from "./repair.model";

enum Role {
  CLIENT = "CLIENT",
  EMPLOYEE = "EMPLOYEE",
}

enum Status {
  ACTIVE = "ACTIVE",
  DISABLED = "DISABLED",
}

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    nullable: false,
    length: 100,
  })
  name: string;

  @Column({
    nullable: false,
    length: 100,
  })
  email: string;

  @Column({
    nullable: false,
    length: 100,
  })
  password: string;

  @Column({
    type: "enum",
    nullable: false,
    enum: Role,
    default: Role.CLIENT,
  })
  role: Role;

  @Column({
    type: "boolean",
    default: false,
  })
  emailValidated: boolean;

  @Column({
    type: "enum",
    nullable: false,
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  encryptPassword() {
    this.password = bcryptAdapter.hash(this.password);
  }

  @OneToMany(() => Repairs, (repair) => repair.user)
  repairs: Repairs[];
}
