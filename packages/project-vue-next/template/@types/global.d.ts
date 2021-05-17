export {}

declare global {
  const enum BUILD_MODE {
    DEV = 'dev',
    TEST = 'test',
    PROD = 'prod'
  }

  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined
      BUILD_MODE: BUILD_MODE
    }
  }
}
