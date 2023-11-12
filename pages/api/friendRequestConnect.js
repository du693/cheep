import Friend from "@/models/Friend";
import User from "@/models/User"; // Assuming you have a User model
import { connectToMongoose } from "./mongooseConnect";
import withSession from "@/withSession";

const handler = async (req, res) => {
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
				// If the receiver doesn't exist, return an error
				return res.status(404).json({ error: "Receiver not found" });
			}

			// Similarly, you may want to validate the sender as well
			const senderUser = await User.findOne({ username: sender }).exec();
			if (!senderUser) {
				// If the sender doesn't exist, return an error
				return res.status(404).json({ error: "Sender not found" });
			}

			// Now you have both senderId and receiverId, which you can use to create the Friend request
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
