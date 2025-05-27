import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AzureADProvider from "next-auth/providers/azure-ad";
import EmailProvider from "next-auth/providers/email";
import { Resend } from "resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { Adapter } from "next-auth/adapters";
import { NextAuthOptions } from "next-auth";

const resend = new Resend(process.env.RESEND_API_KEY);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    AzureADProvider({
      clientId: process.env.MICROSOFT_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
    }),
    EmailProvider({
      // DO NOT include `id` here; TypeScript will error
      server: "",
      from: process.env.EMAIL_FROM!,
      sendVerificationRequest: async ({ identifier: email, url }) => {
        await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: email,
          subject: "Sign in to 2GPTS",
          html: `<p><a href="${url}">Click here to sign in</a></p>`,
        });
      },
    }),
    {
      id: "google-workspace",
      name: "Google Workspace",
      type: "oauth",
      wellKnown: process.env.GOOGLE_OIDC_DISCOVERY_URL,
      clientId: process.env.GOOGLE_OIDC_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OIDC_CLIENT_SECRET!,
      authorization: {
        params: { scope: "openid email profile" },
      },
      idToken: true,
      checks: ["pkce", "state"],
      profile(profile /*: any */) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    },
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};