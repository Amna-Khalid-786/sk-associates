import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter email and password');
                }

                await dbConnect();

                const normalizedEmail = credentials.email.toLowerCase();

                // Hardcoded Admin Access (amnapersonal4@gmail.com)
                const ADMIN_EMAIL = 'amnapersonal4@gmail.com';
                const ADMIN_PASS = 'amnapersonal4@gmail.com';

                if (normalizedEmail === ADMIN_EMAIL && credentials.password === ADMIN_PASS) {
                    return {
                        id: 'admin_root',
                        email: ADMIN_EMAIL,
                        name: 'SK Admin',
                        role: 'admin',
                    };
                }

                const user = await User.findOne({ email: normalizedEmail });

                if (!user || !user.password) {
                    throw new Error('No user found with this email');
                }

                const isPasswordCorrect = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordCorrect) {
                    throw new Error('Invalid password');
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role || 'user',
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: any; user?: any }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }: { session: any; token: any }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
};

console.log('Incoming NextAuth request:', process.env.NEXTAUTH_URL);
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
