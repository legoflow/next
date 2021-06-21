export const enum BUILD_MODE {
  DEVELOP = 'develop',
  TEST = 'test',
  PRODUCTION = 'production'
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined
      BUILD_MODE: BUILD_MODE
    }
  }
}
