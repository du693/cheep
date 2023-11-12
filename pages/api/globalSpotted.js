import withSession from "@/withSession";
import GlobalSpot from "../../models/Spot";
import { connectToMongoose } from "./mongooseConnect";

const handler = async (req, res) => {
	if (req.method === "GET") {
		try {
			// Connect to the database using your connection logic
			await connectToMongoose();

			console.log("global spotted.js is connected to mongoose");

			const globalSpots = await GlobalSpot.find();

			if (!globalSpots) {
				return res
					.status(404)
					.json({ error: "Global spots not found" });
			}
			return res.status(200).json({ globalSpots });
		} catch (error) {
			console.error("Error:", error);
			return res.status(500).json({ error: "Server error" });
		}
	}
};

export default withSession(handler);
