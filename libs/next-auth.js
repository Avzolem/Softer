import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import config from "@/config";
import connectMongo from "./mongo";
import User from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Set any random key in .env.local
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    // Admin credentials provider
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin Login",
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        // Verificar credenciales de admin
        if (credentials?.username === "solesuave" && credentials?.password === "kipo") {
          return {
            id: "admin-user",
            name: "Administrador",
            email: "admin@softer.mx",
            role: "admin",
            image: null,
          };
        }
        return null;
      },
    }),
    GoogleProvider({
      // Follow the "Login with Google" tutorial to get your credentials
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name ? profile.given_name : profile.name,
          email: profile.email,
          image: profile.picture,
          createdAt: new Date(),
        };
      },
    }),
    // Follow the "Login with Email" tutorial to set up your email server
    // Requires a MongoDB database. Set MONOGODB_URI env variable.
    ...(connectMongo
      ? [
          EmailProvider({
            server: {
              host: "smtp.resend.com",
              port: 465,
              auth: {
                user: "resend",
                pass: process.env.RESEND_API_KEY,
              },
            },
            from: config.resend.fromNoReply,
          }),
        ]
      : []),
  ],
  // New users will be saved in Database (MongoDB Atlas). Each user (model) has some fields like name, email, image, etc..
  // Requires a MongoDB database. Set MONOGODB_URI env variable.
  // Learn more about the model type: https://next-auth.js.org/v3/adapters/models
  ...(connectMongo && { adapter: MongoDBAdapter(connectMongo) }),

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Include user role in JWT token
      if (user) {
        token.role = user.role || "user";
        token.email = user.email;
        token.name = user.name;
      }

      // Refresh user data if session is updated
      if (trigger === "update" && session?.user) {
        // Skip database lookup for admin credentials user
        if (token.sub === "admin-user") {
          token.role = "admin";
        } else {
          try {
            const dbUser = await User.findById(token.sub);
            if (dbUser) {
              token.role = dbUser.role || "user";
            }
          } catch (error) {
            }
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;

        // Always fetch fresh role from database
        // Skip database lookup for admin credentials user
        if (token.sub === "admin-user") {
          session.user.role = "admin";
        } else {
          try {
            const dbUser = await User.findById(token.sub);
            session.user.role = dbUser?.role || "user";
          } catch (error) {
            session.user.role = token.role || "user";
          }
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  theme: {
    brandColor: config.colors.main,
    // Add you own logo below. Recommended size is rectangle (i.e. 200x50px) and show your logo + name.
    // It will be used in the login flow to display your logo. If you don't add it, it will look faded.
    logo: `https://${config.domainName}/logoAndName.png`,
  },
});

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    // Admin credentials provider
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin Login",
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        // Verificar credenciales de admin
        if (credentials?.username === "solesuave" && credentials?.password === "kipo") {
          return {
            id: "admin-user",
            name: "Administrador",
            email: "admin@softer.mx",
            role: "admin",
            image: null,
          };
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name ? profile.given_name : profile.name,
          email: profile.email,
          image: profile.picture,
          createdAt: new Date(),
        };
      },
    }),
    ...(connectMongo
      ? [
          EmailProvider({
            server: {
              host: "smtp.resend.com",
              port: 465,
              auth: {
                user: "resend",
                pass: process.env.RESEND_API_KEY,
              },
            },
            from: config.resend.fromNoReply,
          }),
        ]
      : []),
  ],
  ...(connectMongo && { adapter: MongoDBAdapter(connectMongo) }),
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role || "user";
        token.email = user.email;
        token.name = user.name;
      }
      if (trigger === "update" && session?.user) {
        // Skip database lookup for admin credentials user
        if (token.sub === "admin-user") {
          token.role = "admin";
        } else {
          try {
            const dbUser = await User.findById(token.sub);
            if (dbUser) {
              token.role = dbUser.role || "user";
            }
          } catch (error) {
            }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;
        // Skip database lookup for admin credentials user
        if (token.sub === "admin-user") {
          session.user.role = "admin";
        } else {
          try {
            const dbUser = await User.findById(token.sub);
            session.user.role = dbUser?.role || "user";
          } catch (error) {
            session.user.role = token.role || "user";
          }
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  theme: {
    brandColor: config.colors.main,
    logo: `https://${config.domainName}/logoAndName.png`,
  },
};
