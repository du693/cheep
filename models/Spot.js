import mongoose from "mongoose";
const GlobalSpotSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: false,
		sparse: true,
		required: true,
	},

	spotted: {
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
			description: {
				type: String,
				required: false,
			},
		},
	},
	timeSpotted: {
		type: Date,
		default: Date.now,
		expires: 60 * 60 * 24,
	},
});

const GlobalSpot =
	mongoose.models.GlobalSpot ||
	mongoose.model("GlobalSpot", GlobalSpotSchema);

export default GlobalSpot;
