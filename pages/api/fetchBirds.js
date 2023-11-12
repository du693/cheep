import { connectToDB, client } from "./connect";

async function fetchBirdNames() {
	try {
		await connectToDB();

		const db = client.db("NEBirds");
		const collection = db.collection("bird-list");

		const birds = await collection.find({}).toArray();
		console.log("got the bird names");

		return birds.map((bird) => bird.name);
	} catch (error) {
		console.error("Error fetching bird names:", error);
	} finally {
		await client.close();
	}
}

export { fetchBirdNames };
