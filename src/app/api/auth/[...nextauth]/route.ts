import NextAuth from "next-auth";
import authOptions from "./authOptions"; // On importe `authOptions` depuis `authOptions.ts`

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
