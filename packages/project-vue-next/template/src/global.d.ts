import { BUILD_MODE } from './type'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined
      BUILD_MODE: BUILD_MODE
    }
  }
}
