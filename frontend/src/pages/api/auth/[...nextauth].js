import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import jwtDecode from "jwt-decode";

const BASE_SERVER_URL = "http://django:8000/api/";

async function refreshAccessToken(tokenObject) {
  try {
    // Get a new set of tokens with a refreshToken

    const tokenResponse = await axios.post(
      BASE_SERVER_URL + "user/auth/refresh/",
      { refresh: tokenObject.refreshToken }
    );
    return {
      ...tokenObject,
      accessToken: tokenResponse.data.access,
    };
  } catch (error) {
    return {
      ...tokenObject,
      error: "RefreshAccessTokenError",
    };
  }
}

const providers = [
  CredentialsProvider({
    name: "Login",
    id: "mail-login",
    authorize: async ({ email, password }) => {
      try {
        // Authenticate user with credentials
        const creds = await axios.post(BASE_SERVER_URL + "user/auth/", {
          password,
          email,
        });

        if (creds.data.access) {
          const headers = { Authorization: "Bearer " + creds.data.access };
          const user = await axios.get(BASE_SERVER_URL + "user/me", {
            headers,
          });
          return { ...creds.data, user: user.data };
        }

        return null;
      } catch (e) {
        throw new Error(e);
      }
    },
  }),
];

const callbacks = {
  jwt: async ({ token, user }) => {
    if (user) {
      // This will only be executed at login. Each next invocation will skip this part.
      token.accessToken = user.access;
      token.refreshToken = user.refresh;
      token.user = user.user;
    }

    // If the token is still valid, just return it.
    if (jwtDecode(token.accessToken).exp > Date.now() / 1000) {
      return token;
    }

    // Refresh the token.
    token = await refreshAccessToken(token);
    return token;
  },
  session: async ({ session, token }) => {
    // Here we pass accessToken to the client to be used in authentication with your API
    session.access = token.accessToken;
    session.refresh = token.refreshToken;
    session.user = token.user;
    return session;
  },
};

export const options = {
  providers,
  callbacks,
  pages: {},
  secret: "your_secret",
};

const Auth = (req, res) => NextAuth(req, res, options);
export default Auth;
