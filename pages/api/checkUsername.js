import { connectToMongoose } from "./mongooseConnect";
import User from "../../models/User";
import withSession from "@/withSession";

const handler = async (req, res) => {
	if (req.method === "POST") {
		try {
			await connectToMongoose();
			console.log("this shit connected");
			const { username } = req.body;
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
