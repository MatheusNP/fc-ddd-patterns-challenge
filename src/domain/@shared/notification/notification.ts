export type NotificationError = {
  message: string;
  context: string;
};

export default class Notification {
  private errors: NotificationError[] = [];

  addError(error: NotificationError): void {
    this.errors.push(error);
  }

  messages(context?: string): string {
    return this.errors
      .filter((error) => context === undefined || error.context === context)
      .map((error) => `${error.context}: ${error.message}`)
      .join(', ');
  }
}
