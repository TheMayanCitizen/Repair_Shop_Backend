export class CreateRepairDto {
  private constructor(
    public readonly date: Date,
    public readonly userId: number
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateRepairDto?] {
    const { date, userId } = object;

    if (!date) return ["Date missing"];
    if (!userId) return ["User missing"];

    return [undefined, new CreateRepairDto(date, userId)];
  }
}
