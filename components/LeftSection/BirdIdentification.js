import React, { useState, useContext } from "react";
import styles from "./birdIdentification.module.css";
import { CoordinatesContext } from "@/context/Context";

export default function BirdIdentification() {
	const [file, setFile] = useState(null);
	const [fileName, setFileName] = useState(""); // State to store the file name
	const [responseData, setResponseData] = useState(null);
	const { coordinates } = useContext(CoordinatesContext);

	const handleFileChange = (event) => {
		const selectedFile = event.target.files[0];
		if (selectedFile) {
			setFile(selectedFile);
			setFileName(selectedFile.name); // Set the file name
		}
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

		try {
			const response = await fetch("/api/basicHttp", {
				method: "POST",
				body: formData,
			});

			const data = await response.json();
			setResponseData(data["externalData"][0]["common_name"]); // Update the state with the response data
			console.log(data);
		} catch (error) {
			console.error("Error in file upload:", error);
		}
	};

	return (
		<div className={styles.birdIdentification}>
			{/* <div className={styles.inputField}>
				<form onSubmit={handleSubmit} className={styles.formBox}>
					<div className={styles.fileSection}>
						{!fileName && (
							<label
								htmlFor="audio_file"
								className={styles.customFileUpload}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className={styles.microphone}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
									/>
								</svg>
							</label>
						)}
						<input
							type="file"
							id="audio_file"
							name="audio_file"
							className={styles.inputSection}
							accept="audio/*"
							onChange={handleFileChange}
						/>
						<div>
							{fileName && (
								<div className={styles.fileName}>
									{fileName}
								</div>
							)}
						</div>
					</div>
					<div className={styles.uploadAudioDiv}>
						{fileName ? (
							<button
								type="submit"
								className={styles.uploadAudio}
							>
								Upload Audio
							</button>
						) : (
							<div className={styles.uploadHelper}>
								<i>
									<b>&#8592;</b>upload bird sound audio to
									utilize birdNET machine learning
									identificatiom
								</i>
							</div>
						)}
					</div>
				</form>

				{/* Conditional rendering to display responseData */}
			{/* </div> */} */
			{/* <div className={styles.birdIdentificationResponse}>
				{responseData ? (
					<pre>{JSON.stringify(responseData, null, 2)}</pre>
				) : (
					<div></div>
				)}
			</div> */}
		</div>
	);
}
