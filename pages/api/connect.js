import { MongoClient, ServerApiVersion } from "mongodb";
const uri =
	"mongodb+srv://jackcarleo1:IXMegVI2573kWMT0@birds.w7leg4t.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function connectToDB() {
	try {
		await client.connect();
		console.log("Successfully connected to the database.");
	} catch (error) {
		console.error("Error connecting to the database:", error);
	}
	return client;
}
export { connectToDB, client };

//might not need this file?
