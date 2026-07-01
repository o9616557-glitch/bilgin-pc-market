export const ADMIN_EMAIL = "o9616557@gmail.com";

export function adminMi(email?: string | null): boolean {
  return email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
