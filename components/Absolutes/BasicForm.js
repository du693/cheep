import React, { useState } from "react";
import styles from "./basicform.module.css";
import { useContext } from "react";
import { CoordinatesContext } from "@/context/Context";
export default function YourFormComponent() {
	const [inputValue, setInputValue] = useState("");
	const [file, setFile] = useState(null);
	const { coordinates } = useContext(CoordinatesContext);

	const handleFileChange = (event) => {
		setFile(event.target.files[0]); // Get the first file
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		console.log(coordinates);

		if (!file) {
			console.log("No file selected");
			return;
		}

		const formData = new FormData();
		formData.append("audio_file", file);
		formData.append("lat", coordinates.lat);
		formData.append("lng", coordinates.lng);

		console.log(formData);
		try {
			const response = await fetch("/api/basicHttp", {
				method: "POST",
				body: formData, // Send the FormData
			});

			const responseData = await response.json();
			console.log(responseData);
		} catch (error) {
			console.error("Error in file upload:", error);
		}
	};

	return (
		<div className={styles.inputField}>
			<form onSubmit={handleSubmit}>
				<input
					type="file"
					name="audio_file"
					accept="audio/*" // Accept only audio files
					onChange={handleFileChange}
				/>
				<button type="submit">Upload Audio</button>
			</form>
		</div>
	);
}
