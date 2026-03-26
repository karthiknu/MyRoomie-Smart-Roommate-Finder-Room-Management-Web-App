
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import createUser from '@/app/actions/createUser';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      const { email, image, name } = user;
      const { provider, providerAccountId } = account;
      const userData = {
        email: email,
        image: image,
        name: name,
        provider: provider,
        providerAccountId: providerAccountId,
      };
      if (email) {
        await createUser(userData);
      }
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
