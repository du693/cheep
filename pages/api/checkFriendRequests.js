import Friend from "@/models/Friend";
import User from "@/models/User";
import { connectToMongoose } from "./mongooseConnect";
import withSession from "@/withSession";

const handler = async (req, res) => {
	if (req.method === "GET") {
		try {
			const { username } = req.query;

			if (!username) {
				return res
					.status(400)
					.json({ message: "Username is required" });
			}
			await connectToMongoose();
			const userFriendRequests = await Friend.find({
				receiver: username,
				status: "pending",
			});
			return res.status(200).json(userFriendRequests);
		} catch (error) {
			console.error("Failed to retrieve friend requests", error);
			return res.status(500).json({ message: "Server error", error });
		}
	}
	if (req.method === "PUT") {
		try {
			await connectToMongoose();
			const { id } = req.query;
			const { status } = req.body;
			const updatedRequest = await Friend.findByIdAndUpdate(
				id,
				{ status },
				{ new: true }
			);
			if (!updatedRequest) {
				return res
					.status(404)
					.json({ message: "Friend request not found" });
			}
			if (status === "accepted") {
				await User.updateOne(
					{ username: updatedRequest.receiver },
					{
						$addToSet: {
							friends: updatedRequest.senderId,
						},
					}
				);
				await User.updateOne(
					{ username: updatedRequest.sender },
					{
						$addToSet: {
							friends: updatedRequest.receiverId,
						},
					}
				);
			}

			return res.status(200).json(updatedRequest);
		} catch (error) {
			res.status(500).json({ message: "Server error", error });
		}
	}
};

export default withSession(handler);
