import styles from "./addspot.module.css";
import { CoordinatesContext } from "@/context/Context";
import { useContext, useState, useEffect } from "react";

export default function AddSpot({ openSection }) {
	const { coordinates } = useContext(CoordinatesContext);
	const { lat, lng } = coordinates;
	const [isVisible, setIsVisible] = useState(true);
	const handleAddSpotClick = () => {
		setIsVisible(false);
		openSection("searchSection");
	};

	useEffect(() => {
		if (lat !== null && lng !== null) {
			setIsVisible(true);
		}
	}, [lat, lng]);

	return (
		isVisible && (
			<div className={styles.addspot} onClick={handleAddSpotClick}>
				<h1>Add a Bird Sighting</h1>
			</div>
		)
	);
}
