import mongoose from "mongoose";
import User from "@/models/User";
import Friend from "@/models/Friend";

const uri = process.env.MONGOOSE_URI;

async function connectToMongoose() {
	if (mongoose.connection.readyState === 0) {
		try {
			await mongoose.connect(uri, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			});
			console.log("Successfully connected to the database.");
		} catch (error) {
			console.error("Error connecting to the database:", error);
		}
	}
}

export { connectToMongoose, User, Friend };
