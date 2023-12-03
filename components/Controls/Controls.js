import SearchBar from "./searchBar";
import styles from "./controls.module.css";
import React from "react";

const Controls = React.memo(function Controls({
	isLocationMyLocation,
	birdData,
	addSpot,
	setUserLocationToggleFunction,
}) {
	return (
		<div className={styles.section2}>
			<div className={styles.container}>
				<div className={styles.containerHeader2}>
					<h1>
						<u>Add a Bird Sighting</u>
					</h1>
				</div>
				<div className={`${styles.searchSection}`}>
					<SearchBar
						isLocationMyLocation={isLocationMyLocation}
						birdData={birdData}
						addSpot={addSpot}
						setUserLocationToggleFunction={
							setUserLocationToggleFunction
						}
					/>
				</div>
			</div>
		</div>
	);
});
export default Controls;
