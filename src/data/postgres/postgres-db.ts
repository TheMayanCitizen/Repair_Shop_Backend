import { DataSource } from "typeorm";
import { Users } from "./models/user.model";
import { Repairs } from "./models/repair.model";

interface Options {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export class PostgresDatabase {
  private datasource: DataSource;

  constructor(options: Options) {
    this.datasource = new DataSource({
      type: "postgres",
      host: options.host,
      port: options.port,
      username: options.username,
      password: options.password,
      database: options.database,
      entities: [Users, Repairs],
      synchronize: true, //Este en produccion se usan migraciones en vez de syncronize.
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  async connect() {
    try {
      await this.datasource.initialize();
      console.log("Connected to DB");
    } catch (error) {
      console.log(error);
    }
  }
}
