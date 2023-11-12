import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
	sender: {
		type: String,
		required: true,
		ref: "User",
	},
	senderId: {
		type: mongoose.Schema.Types.ObjectId, // Assuming you want to store references to other Users
		ref: "User",
	},
	receiver: {
		type: String,
		required: true,
		ref: "User",
	},
	receiverId: {
		type: mongoose.Schema.Types.ObjectId, // Assuming you want to store references to other Users
		ref: "User",
	},
	status: {
		type: String,
		enum: ["pending", "accepted", "rejected"],
		default: "pending",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Friend = mongoose.models.Friend || mongoose.model("Friend", friendSchema);

export default Friend;
