export class UpdateUserDto {
  constructor(public readonly name: string, public readonly email: string) {}

  static updateUser(object: {
    [key: string]: string;
  }): [string?, UpdateUserDto?] {
    const { name, email } = object;

    if (!name) return ["Name is missing"];
    if (!email) return ["Email is missing"];

    return [undefined, new UpdateUserDto(name, email)];
  }
}
