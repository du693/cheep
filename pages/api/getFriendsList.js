import { connectToMongoose } from "./mongooseConnect";
import User from "../../models/User";
import withSession from "@/withSession";

const handler = async (req, res) => {
	if (req.method === "GET") {
		try {
			await connectToMongoose();
			// Get the username from the query parameters, not the request body
			const { username } = req.query;

			// Find the user by username
			let user = await User.findOne({ username: username }).populate(
				"friends"
			);
			// Assuming 'friends' is an array of ObjectId references to other User documents

			if (user) {
				// Send the friends array back to the client
				res.status(200).json({ friends: user.friends });
			} else {
				// If no user is found, send a 404 response
				res.status(404).json({ message: "User not found" });
			}
		} catch (error) {
			// If there's an error, send a 500 response
			res.status(500).json({ message: "Server error", error });
		}
	} else {
		// If the request method is not GET, send a 405 response
		res.status(405).json({ message: "Method not allowed" });
	}
};
export default withSession(handler);
