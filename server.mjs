import express from "express";
import next from "next";
import https from "https";
import fs from "fs";

const port = process.env.PORT || 443; // Change the port to 443 for HTTPS
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const privateKey = fs.readFileSync(
	"/etc/letsencrypt/live/cheepbirds.com/privkey.pem",
	"utf8"
);
const certificate = fs.readFileSync(
	"/etc/letsencrypt/live/cheepbirds.com/fullchain.pem",
	"utf8"
); // Replace with the actual path to your certificate
const credentials = { key: privateKey, cert: certificate };

app.prepare().then(() => {
	const server = express();

	// You can add custom server logic here

	// Handling all other requests with Next.js
	server.all("*", (req, res) => {
		return handle(req, res);
	});

	// Create an HTTPS server
	const httpsServer = https.createServer(credentials, server);

	httpsServer.listen(port, "cheepbirds.com", (err) => {
		if (err) throw err;
		console.log(`> Ready on https://cheepbirds.com:${port}`);
	});
});
