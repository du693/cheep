import { connectToMongoose } from "./mongooseConnect";
import User from "../../models/User";
import GlobalSpot from "@/models/Spot";
import withSession from "@/withSession";

const handler = async (req, res) => {
	if (req.method === "POST") {
		try {
			await connectToMongoose();
			const { userId, username, spotted } = req.body;
			let requestBody = { userId, spotted };

			if (username) {
				requestBody.username = username;
			}
			//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			if (requestBody.username) {
				const globalSpot = new GlobalSpot({
					username: requestBody.username,
					spotted: requestBody.spotted,
				});
				await globalSpot.save();
			}

			////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			let user = await User.findOne({ email: requestBody.userId });

			if (!user) {
				user = new User({
					email: requestBody.userId,
					spotted: [requestBody.spotted],
				});
				await user.save();
				return res.status(201).json({
					success: true,
					message: "User created and bird spotting added",
				});
			} else {
				user.spotted.push(requestBody.spotted);
				await user.save();
				return res
					.status(200)
					.json({ success: true, message: "Bird spotting added" });
			}
		} catch (error) {
			return res.status(500).json({ error: "Server error" });
		}
	}

	// };
	if (req.method === "GET") {
		try {
			await connectToMongoose();
			const { userId } = req.query;

			const user = await User.findOne({ email: userId });

			if (!user) {
				return res.status(404).json({ error: "User not found" });
			}

			return res.status(200).json(user);
		} catch (error) {
			return res.status(500).json({ error: "Server error" });
		}
	}

	if (req.method === "PUT") {
		try {
			await connectToMongoose();
			const { userId } = req.query;
			const {
				username: { username },
			} = req.body;

			// Input validation (add your validation logic here)
			if (!username /* add validation conditions */) {
				return res.status(400).json({ error: "Invalid username" });
			}

			const user = await User.findOne({ email: userId });

			console.log("user", user);
			console.log("userId", userId);
			console.log("username", username);

			if (!user) {
				return res.status(404).json({ error: "User not found" });
			}

			user.username = username;

			try {
				await user.save();
				return res
					.status(200)
					.json({ success: true, message: "Username updated" });
			} catch (error) {
				if (error.code === 11000) {
					return res
						.status(409)
						.json({ error: "Username has already been picked." });
				}
				throw error; // Re-throw the error if it's not a duplication error
			}
		} catch (error) {
			return res.status(500).json({ error: "Server error" });
		}
	}
};

export default withSession(handler);
