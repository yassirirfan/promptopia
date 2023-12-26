import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import axios from "axios";
import { connectToDB } from '@utils/database';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: '514065481595-dqe7qpqbf8g1ra94fmcknkgase61na3j.apps.googleusercontent.com',
      clientSecret: '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',
    })
  ],
  callbacks: {
    async session({ session }) {
      // store the user id from MongoDB to session
      if (session !== undefined){
        const sessionUser = await axios.post('http://localhost:8016/r-odoo/findOne', {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            login: session['user']['email']
          },
      })
        if(sessionUser.data.result){
          session.user.id = sessionUser.data.result.id.toString();
          return session;
        }
        return false
      }
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        await connectToDB();
        // checks if user already exists if not creates one and return the created
        await axios.post('http://localhost:8016/r-odoo/findOrCreateOne', {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            login: profile.email,
            name: profile.name
          },
        })
        return true
      } catch (error) {
        console.log("Error checking if user exists: ", error.message);
        return false
      }
    },
  }
})

export { handler as GET, handler as POST }