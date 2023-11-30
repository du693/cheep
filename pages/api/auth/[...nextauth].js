import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import { connectToMongoose } from "../mongooseConnect";
import { redirect } from "next/dist/server/api-utils";

export const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
		}),
		GithubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
		}),
		LinkedInProvider({
			clientId: process.env.LINKEDIN_CLIENT_ID,
			clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
			authorization: {
				params: { scope: "openid profile email" },
			},
			issuer: "https://www.linkedin.com",
			jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
			async profile(user) {
				return {
					id: user.sub,
					email: user.email,
					image: user.picture,
				};
			},
		}),
	],
	session: {
		strategy: "jwt",
	},

	callbacks: {
		async signIn(user, account, profile) {
			console.log("User object:", user);

			try {
				await connectToMongoose();
				console.log("Connected to MongoDB");
				let existingUser = null;

				if (
					user.account.provider === "google" ||
					user.account.provider === "github" ||
					user.account.provider === "linkedin"
				) {
					existingUser = await User.findOne({
						email: user.user.email,
					});
				}
				if (
					existingUser &&
					JSON.stringify(user.account.provider) !==
						JSON.stringify(existingUser.loginType)
				) {
					return false;
				}

				if (!existingUser) {
					let loginType = "unknown";
					console.log("here is the new user", user);

					if (user.account.provider) {
						if (user.account.provider === "google") {
							loginType = "google";
						} else if (user.account.provider === "github") {
							loginType = "github";
						} else if (user.account.provider === "linkedin") {
							loginType = "linkedin";
						}
					}

					const newUser = new User({
						email: user.user.email,
						spotted: [],
						friends: [],
						loginType: loginType,
					});

					await newUser.save();
				}

				return true; // Allow the sign-in to proceed
			} catch (error) {
				console.error("Error during signIn callback:", error);
				throw error; // You can choose to handle the error as needed
			}
		},
	},
};

export default NextAuth(authOptions);
