class Camelot {
  static id = "Camelot Test";

  static isMatch() {
    return true;
  }

  static init() {
    return { state: {} };
  }

  async *run(ctx) {
    ctx.log("Welcome to Camelot!");
    ctx.log("Tis a silly place.");
  }
}
