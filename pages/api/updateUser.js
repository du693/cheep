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
			const { username } = req.body;
			const user = await User.findOne({ email: requestBody.userId });

			if (!user) {
				return res.status(404).json({ error: "User not found" });
			}

			user.username = requestBody.username;

			await user.save();

			return res
				.status(200)
				.json({ success: true, message: "Username updated" });
		} catch (error) {
			return res.status(500).json({ error: "Server error" });
		}
	}
};

export default withSession(handler);
