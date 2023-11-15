import { Username } from "@/context/Context";
import { useContext } from "react";
import styles from "./infobox.module.css";
export default function InfoBox({
	selectedBird,
	formattedDate,
	onCloseClick,
	globalIsOn,
	globalUser,
}) {
	const { username } = useContext(Username);
	return (
		<div className={styles.infoWindow}>
			{!globalIsOn ? (
				<h1 className={styles.fuck}>spotter: {username}</h1>
			) : (
				<h1 className={styles.fuck}>spotter: {globalUser}</h1>
			)}

			<p>{selectedBird.birdName}</p>

			<p>{selectedBird.timeSpotted && formattedDate}</p>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke="currentColor"
				className={styles.x}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</div>
	);
}
