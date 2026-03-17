declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}
// This empty export makes the file a module, allowing declare global to work properly
export {};
