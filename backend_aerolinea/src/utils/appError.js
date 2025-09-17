export class AppError extends Error {
  constructor(status, code, message, field = null) {
    super(message);
    this.status = status;   // HTTP status
    this.code = code;       // código interno de error
    this.field = field;     // campo afectado (opcional)
  }
}