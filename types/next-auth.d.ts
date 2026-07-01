import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      deviceId?: string;
      isAdmin?: boolean;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    deviceId?: string;
    isAdmin?: boolean;
    isLoggedOut?: boolean;
    lastDeviceCheck?: number;
    dbImage?: string;
  }
}
