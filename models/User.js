import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	username: {
		type: String,
		unique: true,
		sparse: true,
		required: false,
	},
	loginType: {
		type: String,
		required: true,
		unique: true,
	},
	spotted: [
		{
			type: {
				lat: {
					type: Number,
					required: true,
				},
				lng: {
					type: Number,
					required: true,
				},
				birdName: {
					type: String,
					required: true,
				},
				timeSpotted: {
					type: Date,
					default: Date.now,
				},
				description: {
					type: String,
					required: false,
				},
			},

			default: [],
		},
	],
	friends: [
		{
			type: mongoose.Schema.Types.ObjectId, // Assuming you want to store references to other Users
			ref: "User", // Reference to the same schema
		},
	],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
