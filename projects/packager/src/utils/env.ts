class EnvironmentVariables {
  /** The server port it should listen to */
  get PACKAGER_PORT(): number {
    return parseInt(process.env.PACKAGER_PORT ?? '3012', 10);
  }

  /** The node environment this server is running in */
  get NODE_ENV(): 'production' | 'development' | 'test' {
    switch (process.env.NODE_ENV) {
      case 'production':
        return 'production';
      case 'test':
        return 'test';
      default:
        return 'development';
    }
  }
}

export const env = new EnvironmentVariables();
