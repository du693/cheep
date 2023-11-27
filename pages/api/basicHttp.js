import { IncomingForm } from "formidable";
import FormData from "form-data";
import fetch from "node-fetch"; // If you're using node-fetch
import fs from "fs";

export const config = {
	api: {
		bodyParser: false, // Disable the default Next.js body parser
	},
};

export default async function handler(req, res) {
	if (req.method === "POST") {
		const form = new IncomingForm();

		form.parse(req, async (err, fields, files) => {
			if (err) {
				console.error("Error processing form data:", err);
				res.status(500).json({ error: "Error processing form data" });
				return;
			}

			try {
				const audioFile = files.audio_file[0];
				const lat = fields.lat;
				const lng = fields.lng;
				console.log("HERE SHE BLOWS,", lat, lng);

				if (!audioFile) {
					res.status(400).json({ error: "No audio file uploaded" });
					return;
				}
				const formData = new FormData();
				formData.append(
					"audio_file",
					fs.createReadStream(audioFile.filepath),
					{
						contentType: "audio/mpeg",
						filename: audioFile.originalFilename,
					}
				);
				formData.append("lat", lat[0]);
				formData.append("lng", lng[0]);
				console.log("FORM DATA HERE", formData);
				const externalResponse = await fetch(
					"http://100.26.146.73/upload_audio",
					{
						method: "POST",
						body: formData,
						headers: formData.getHeaders(),
					}
				);

				if (!externalResponse.ok) {
					throw new Error(
						`External API responded with status ${externalResponse.status}`
					);
				}

				const externalData = await externalResponse.json();
				return res
					.status(200)
					.json({ message: "here is the message", externalData });
			} catch (error) {
				console.error("Error in POST request:", error);
				res.status(500).json({ error: error.message });
			}
		});
	} else {
		res.setHeader("Allow", ["POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
