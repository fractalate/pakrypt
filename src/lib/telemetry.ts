class Telemetry {
  log(...args: any[]) {
    console.log(...args);
  }

  info(...args: any[]) {
    console.info(...args);
  }

  warn(...args: any[]) {
    console.warn(...args);
  }

  error(...args: any[]) {
    console.error(...args);
  }
}

export const telemetry = new Telemetry();
