// Split the auth provider config into a separate file
// More info: https://authjs.dev/guides/edge-compatibility#split-config

import { NextAuthConfig } from "next-auth";

export const authProviderConfigList = {
  providers: [],
} satisfies NextAuthConfig;