import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import { User } from "models/userModal";
import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google";

interface Credentials {
  email: string;
  password: string;
}

async function login(credentials: Credentials) {
  try {
    const user = await User.findOne({ email: credentials.email });
    if (!user) {
      throw new Error("Wrong Credentials");
    }
    const isCorrect = await bcrypt.compare(credentials.password, user.password);
    if (!isCorrect) {
      throw new Error("Wrong Credentials");
    }
    return user;
  } catch (error) {
    console.log("Error while logging in:", error);
    throw new Error("Something went wrong");
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials: any) {
        try {
          const user = await login(credentials);
          return user;
        } catch (error: any) {
          throw new Error("Failed to login.");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.username = user.username;
        token.email = user.email;
        token.id = user.id;
      }
      console.log("Final token", token);
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.id = token.id;
      }
      console.log("this is Session", session);
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
