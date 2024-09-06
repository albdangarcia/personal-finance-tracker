/*
This middleware imports the configuration without the database adapter and creates its own Auth.js client. 
Note: Database functionality and support have been removed from next-auth in this middleware. 
      As a result, we can’t fetch session details, user account information, etc., while executing code in the middleware.
      To protect your routes effectively, use checks on the front end files using const session = await auth(), !session, etc.
      Middleware will still handle extending the session cookie's expiry time.
*/
import NextAuth from "next-auth";
import { authProviderConfigList } from "./auth.config";

export const { auth: middleware } = NextAuth(authProviderConfigList)

// Filter Middleware to avoid API routes and static assets
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
