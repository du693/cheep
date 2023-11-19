import { useState, useContext } from "react";
import styles from "./searchbar.module.css";
import { CoordinatesContext } from "@/context/Context";
import AddButton from "./AddButton";

const SearchBar = ({
	isLocationMyLocation,
	birdData,
	addSpot,
	userLocationToggle,
	setUserLocationToggleFunction,
}) => {
	const [descQuery, setDescQuery] = useState("");
	const [query, setQuery] = useState("");
	const { coordinates, setCoordinates } = useContext(CoordinatesContext);
	const { lat, lng } = coordinates;

	const [results, setResults] = useState([]);
	const [isToggleOn, setIsToggleOn] = useState(false);
	const inputOpacity = lat !== null && lng !== null ? 1 : 0.1;
	const [file, setFile] = useState(null);
	const [fileName, setFileName] = useState(""); // State to store the file name
	const [responseData, setResponseData] = useState(null);
	const [responseLoading, setResponseLoading] = useState(false);

	const inputPlaceholder =
		lat !== null && lng !== null
			? "Search for bird species:"
			: "Please click where the bird was spotted";

	const handleSearch = () => {
		if (query && lat !== null && lng !== null) {
			console.log(descQuery);
			addSpot({ bird: query, lat, lng, description: descQuery });
			setResults([]);
			setQuery([]);
			setDescQuery("");
		} else {
			console.log("Ensure bird name and coordinates are set");
		}
	};
	const handleInputChange = (e) => {
		const value = e.target.value;
		setQuery(value);

		if (value) {
			const filtered = birdData.filter((item) =>
				item.toLowerCase().includes(value.toLowerCase())
			);
			setResults(filtered);
		} else {
			setResults([]);
		}
	};
	const handleBirdSelection = (bird) => {
		setQuery(bird);
		setResults([]);
	};

	const userLocationClick = () => {
		setUserLocationToggleFunction(true);
		console.log("hi");
	};

	const handleFileChange = (event) => {
		const selectedFile = event.target.files[0];
		if (selectedFile) {
			setFile(selectedFile);
			setFileName(selectedFile.name); // Set the file name
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setResponseLoading(true);
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
			setResponseData(data["externalData"][0]["common_name"]);
			setResponseLoading(false);
			console.log(data);
		} catch (error) {
			console.error("Error in file upload:", error);
		}
	};
	const emptyFile = () => {
		setFile(null);
		setFileName("");
		setResponseData(null);
	};

	return (
		<div className={styles.addSection}>
			<div className={styles.coordBox}>
				<p>
					1. Click where you spotted the bird or use your current
					location.
				</p>
				<div className={styles.latLng}>
					<div>
						<h2>Latitude</h2>
						<h2>Longitude</h2>
						<div></div>
						<input
							type="number"
							placeholder="Latitude..."
							value={lat || ""}
							onChange={(e) => setLat(e.target.value)}
							className={styles.coords}
							readOnly
						/>

						<input
							type="number"
							placeholder="Longitude..."
							value={lng || ""}
							onChange={(e) => setLng(e.target.value)}
							className={styles.coords}
							readOnly
						/>
						<button
							onClick={() => userLocationClick()}
							className={`${styles.currentLocationButton} ${
								isLocationMyLocation ? styles.active : ""
							}`}
						>
							Current Location
						</button>
					</div>
				</div>
			</div>

			<div className={styles.searchBox}>
				<p>
					2. Identify the bird species. Click the microphone to{" "}
					<b>upload audio</b> to help with identification process. Or
					click <u>here</u> for other identification tools.
				</p>
				<h2 className={styles.sectionTitle}>Bird Identification</h2>
				<div className={styles.searchAndAudio}>
					<input
						type="text"
						className={styles.inputField}
						placeholder={inputPlaceholder}
						value={query}
						onChange={handleInputChange}
						style={{ opacity: inputOpacity }}
						title="Bird Identification"
					></input>

					<div className={styles.microphoneDiv}>
						<form
							onSubmit={handleSubmit}
							className={styles.formBox}
						>
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

							<input
								type="file"
								id="audio_file"
								name="audio_file"
								className={styles.inputSection}
								accept="audio/*"
								onChange={handleFileChange}
							/>
							{fileName && (
								<div className={styles.fileProcess}>
									<div>
										<div className={styles.fileName}>
											{fileName}
										</div>
									</div>

									<div className={styles.uploadAudioDiv}>
										<button
											type="submit"
											className={styles.uploadAudio}
										>
											Upload Audio
										</button>
									</div>
								</div>
							)}
						</form>
						{fileName && (
							<div className={styles.fileProcessSection}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									onClick={() => {
										emptyFile();
									}}
									stroke="currentColor"
									className={styles.exitUserInfo}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
								<div
									className={
										styles.birdIdentificationResponse
									}
								>
									{responseData ? (
										<pre>
											{" "}
											response:{" "}
											{JSON.stringify(
												responseData,
												null,
												2
											)}
										</pre>
									) : (
										responseLoading && (
											<div>
												<svg
													width="24"
													height="24"
													viewBox="0 0 24 24"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z">
														<animateTransform
															attributeName="transform"
															type="rotate"
															dur="0.75s"
															values="0 12 12;360 12 12"
															repeatCount="indefinite"
														/>
													</path>
												</svg>
											</div>
										)
									)}
								</div>
								{responseData && (
									<form className={styles.isThisTheBird}>
										{" "}
										<label>
											Is this the bird?
											<div className={styles.buttons}>
												<button
													type="button"
													className={`${styles.bbutton} ${styles.yes}`}
													onClick={() => {
														setQuery(responseData);
														emptyFile();
													}}
												>
													Yes
												</button>
												<button
													type="button"
													className={`${styles.bbutton} ${styles.no}`}
													onClick={() => emptyFile()}
												>
													No
												</button>
											</div>
										</label>
									</form>
								)}
							</div>
						)}
					</div>
				</div>
				{results.length > 0 && (
					<ul className={styles.searchResults}>
						{results.map((bird, index) => (
							<li
								key={index}
								onClick={() => handleBirdSelection(bird)}
							>
								{bird}
							</li>
						))}
					</ul>
				)}
			</div>
			<div className={styles.inputContainer}>
				<p>3. leave any additional notes!</p>
				<label htmlFor="additional notes" className={styles.label}>
					Additional Notes
				</label>
				<textarea
					type="text"
					value={descQuery}
					onChange={(e) => {
						setDescQuery(e.target.value);
						console.log(descQuery);
					}}
					id="description"
					name="description"
					className={styles.inputBox}
					placeholder="What were the weather conditions? How many did you see?"
				/>
				<div className={styles.addButtonDiv}>
					<AddButton onClick={handleSearch} />
				</div>
			</div>
		</div>
	);
};

export default SearchBar;
