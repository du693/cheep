import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/User";
import { connectToMongoose } from "../mongooseConnect";

export const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
		}),
	],
	session: {
		strategy: "jwt",
	},

	callbacks: {
		async signIn(user, account, profile) {
			try {
				await connectToMongoose();
				console.log("Connected to MongoDB");

				const existingUser = await User.findOne({
					email: user.user.email,
				});
				if (!existingUser) {
					const newUser = new User({
						email: user.user.email,
						spotted: [],
						friends: [],
					});
					await newUser.save();
					console.log("New user created:", newUser);
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
