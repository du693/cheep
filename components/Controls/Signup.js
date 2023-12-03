import { connectToMongoose } from "../../mongooseConnect";
import User from "@/models/User";

export default async function handler(req, res) {
	if (req.method === "POST") {
		const { username } = req.body;

		try {
			await connectToMongoose();
			await User.findOneAndUpdate(
				{ email: req.user.email },
				{ username: username },
				{ upsert: true }
			);

			res.status(200).json({ message: "Username created successfully." });
		} catch (error) {
			console.error("Error creating username:", error);
			res.status(500).json({ error: "Error creating username." });
		}
	} else {
		res.status(405).end();
	}
}
