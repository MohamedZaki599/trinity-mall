export type AdminSession = {
  admin?: { email: string; loggedInAt: number };
};

export const SESSION_COOKIE = "trinity_admin";
export const ADMIN_SESSION_MAX_AGE = 8 * 60 * 60;
