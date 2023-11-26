import express from "express";
import next from "next";

const port = process.env.PORT || 3000; // Change the port to 3000 for HTTP
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
	const server = express();

	// You can add custom server logic here

	// Handling all other requests with Next.js
	server.all("*", (req, res) => {
		return handle(req, res);
	});

	server.listen(port, (err) => {
		if (err) throw err;
		console.log(`> Ready on http://localhost:${port}`);
	});
});
