import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { getClientIp } from "@/lib/client-ip";
import { findUserByGoogleId, findUserById } from "@/models/user";
import {
  RateLimitedError,
  authenticateCredentials,
  passwordFingerprint,
  signInWithGoogle,
} from "@/services/auth-service";

class TooManyAttempts extends CredentialsSignin {
  code = "too_many_attempts";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  providers: [
    Google, // lit AUTH_GOOGLE_ID et AUTH_GOOGLE_SECRET
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials, request) {
        try {
          return await authenticateCredentials(
            credentials,
            getClientIp(request.headers),
          );
        } catch (error) {
          if (error instanceof RateLimitedError) throw new TooManyAttempts();
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "google") return true;
      return signInWithGoogle(profile);
    },
    async jwt({ token, user, account }) {
      // Connexion avec Google
      if (account?.provider === "google") {
        const dbUser = await findUserByGoogleId(account.providerAccountId);
        if (!dbUser) return null;
        token.id = dbUser.id;
        token.pv = passwordFingerprint(dbUser);
        return token;
      }
      // Connexion avec e-mail et mot de passe
      if (user) {
        token.id = user.id;
        token.pv = user.pv;
        return token;
      }
      // Session existante : le compte existe toujours et son mot de passe
      // n'a pas changé, sinon la session est fermée.
      const dbUser = token.id ? await findUserById(token.id) : null;
      if (!dbUser || passwordFingerprint(dbUser) !== token.pv) return null;
      return token;
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id;
      return session;
    },
  },
});
