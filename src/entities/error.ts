
export class GeneralError extends Error {
    public message: string;
    public status: number;
    public stack?: string;

    public constructor(
      error: {
            message: string;
            status?: number;
            stack?: string;
        },
    ) {
      super();
      const { message, status = 500, stack, } = error;

      if (stack) this.stack = stack; // if no stack is defined in body, the Error class generates one
      this.status = status;
      this.message = message;
    }
}
