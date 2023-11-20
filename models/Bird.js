import mongoose from "mongoose";

const birdSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	index: Number,
	name: String,
});

const Bird = mongoose.models.Bird || mongoose.model("Bird", birdSchema);

export default Bird;
