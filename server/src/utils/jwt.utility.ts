import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  role: string;
}

export class JwtUtility {
  private static secret: string = process.env.JWT_SECRET || 'default-secret-key';
  private static expiresIn: string = process.env.JWT_EXPIRES_IN || '7d';

  static generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn } as jwt.SignOptions);
  }

  static verifyToken(token: string): TokenPayload {
    return jwt.verify(token, this.secret) as TokenPayload;
  }
}
