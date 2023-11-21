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
	baseUrl: "http://cheepbirds:3000",
	callbacks: {
		async signIn(user, account, profile) {
			await connectToMongoose();
			const existingUser = await User.findOne({ email: user.user.email });
			if (!existingUser) {
				const newUser = new User({
					email: user.user.email,
					spotted: [],
					friends: [],
				});
				await newUser.save();
			}

			return true; // Allow the sign-in to proceed
		},
	},
};
export default NextAuth(authOptions);
