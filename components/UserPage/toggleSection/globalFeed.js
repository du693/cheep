import styles from "./globalfeed.module.css";

export default function globalFeed({ globalSpots }) {
	return (
		<div className={styles.friendFeed}>
			<div>
				<ul>
					{globalSpots.map((spot, index) => (
						<li key={index}>Latitude: {spot.spotted.birdName},</li>
					))}
				</ul>
			</div>
		</div>
	);
}
