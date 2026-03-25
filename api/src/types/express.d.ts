declare global {
  namespace Express {
    interface Request {
      user?: import('jose').JWTPayload
    }
  }
}

export {}
