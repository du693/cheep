import { useState, useContext } from "react";
import styles from "./searchbar.module.css";
import { CoordinatesContext } from "@/context/Context";
import AddButton from "./AddButton";

const SearchBar = ({ birdData, addSpot }) => {
	const [descQuery, setDescQuery] = useState("");
	const [query, setQuery] = useState("");
	const { coordinates } = useContext(CoordinatesContext);
	const { lat, lng } = coordinates;
	const [results, setResults] = useState([]);
	const [isToggleOn, setIsToggleOn] = useState(false);
	const inputOpacity = lat !== null && lng !== null ? 1 : 0.1;

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

	return (
		<div className={styles.addSection}>
			<h2 className={styles.sectionTitle}>Bird Identification</h2>
			<div className={styles.searchBox}>
				<input
					type="text"
					className={styles.inputField}
					placeholder={inputPlaceholder}
					value={query}
					onChange={handleInputChange}
					style={{ opacity: inputOpacity }}
					title="Bird Identification"
				></input>
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

			<div className={styles.coordBox}>
				<div className={styles.latLng}>
					<div>
						<h2>Latitude</h2>
						<h2>Longitude</h2>
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
					</div>
				</div>
			</div>
			<div className={styles.inputContainer}>
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
					placeholder=""
				/>
				<div className={styles.addButtonDiv}>
					<AddButton onClick={handleSearch} />
				</div>
			</div>
		</div>
	);
};

export default SearchBar;
