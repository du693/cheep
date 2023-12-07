import Friend from "@/models/Friend";
import User from "@/models/User"; // Assuming you have a User model
import { connectToMongoose } from "./mongooseConnect";
import withSession from "@/withSession";

const handler = async (req, res) => {
	const usernamePattern = /^[a-zA-Z0-9_-]+$/;
	if (req.method === "POST") {
		try {
			await connectToMongoose();
			console.log("Connected to mongoose for friend requests");

			const { sender, receiver } = req.body;

			// First, get the ObjectId of the receiver from the User collection
			const receiverUser = await User.findOne({
				username: receiver,
			}).exec();

			if (!receiverUser) {
				return res.status(404).json({ error: "Receiver not found" });
			}
			if (!usernamePattern.test(receiverUser)) {
				return res
					.status(400)
					.json({ message: "Invalid username format" });
			}

			const senderUser = await User.findOne({ username: sender }).exec();
			if (!senderUser) {
				// If the sender doesn't exist, return an error
				return res.status(404).json({ error: "Sender not found" });
			}
			if (senderUser.friends.includes(receiverUser._id)) {
				return res
					.status(409)
					.json({ error: "Receiver is already a friend" });
			}
			const isRequestPending = await Friend.findOne({
				sender: senderUser.username,
				receiver: receiverUser.username,
				status: "pending",
			});
			if (isRequestPending) {
				return res
					.status(409)
					.json({ error: "Request is already pending" });
			}

			const newFriendRequest = new Friend({
				sender: senderUser.username,
				senderId: senderUser._id,
				receiver: receiverUser.username,
				receiverId: receiverUser._id,
				// status is 'pending' by default
			});

			const savedFriendRequest = await newFriendRequest.save();

			return res.status(201).json(savedFriendRequest);
		} catch (error) {
			console.error("Error saving friend request:", error);
			return res
				.status(500)
				.json({ error: "Server error while creating friend request" });
		}
	} else {
		return res.status(405).json({ error: "Method not allowed" });
	}
};

export default withSession(handler);
