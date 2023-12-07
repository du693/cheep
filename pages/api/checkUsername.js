import { connectToMongoose } from "./mongooseConnect";
import User from "../../models/User";
import withSession from "@/withSession";

const handler = async (req, res) => {
	const usernamePattern = /^[a-zA-Z0-9_-]+$/;
	if (req.method === "POST") {
		try {
			await connectToMongoose();
			console.log("this shit connected");
			const { username } = req.body;
			if (!username) {
				return res
					.status(400)
					.json({ message: "Username is required" });
			}
			if (!usernamePattern.test(username)) {
				return res
					.status(400)
					.json({ message: "Invalid username format" });
			}
			const usernameExists = await User.exists({ username: username });
			res.status(200).json({ exists: usernameExists != null });
		} catch (error) {
			res.status(500).json({ message: "Server error", error: error });
		}
	} else {
		res.setHeader("Allow", ["POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
};

export default withSession(handler);
