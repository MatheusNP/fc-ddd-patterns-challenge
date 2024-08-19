export type NotificationErrorProps = {
  message: string;
  context: string;
};

export default class Notification {
  private errors: NotificationErrorProps[] = [];

  addError(error: NotificationErrorProps): void {
    this.errors.push(error);
  }

  getErrors(): NotificationErrorProps[] {
    return this.errors;
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  messages(context?: string): string {
    return this.errors
      .filter((error) => context === undefined || error.context === context)
      .map((error) => `${error.context}: ${error.message}`)
      .join(', ');
  }
}
