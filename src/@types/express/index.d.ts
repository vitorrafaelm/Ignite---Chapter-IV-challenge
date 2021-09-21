declare namespace Express {
  export interface Request {
    user: {
      id: string;
    }
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
    }
  }
}
