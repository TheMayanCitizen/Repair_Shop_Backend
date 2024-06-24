export class RegisterUserDto {
  private constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string
  ) {}

  static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
    const { name, email, password } = object;

    if (!name) return ["Name missing"];
    if (!email) return ["Email missing"];
    if (!password) return ["Password missing"];

    return [undefined, new RegisterUserDto(name, email, password)];
  }
}
