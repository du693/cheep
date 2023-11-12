import Icon from "@mdi/react";
import { mdiBird } from "@mdi/js";
import styles from "../styles/Home.module.css";

export default function MobileUI() {
	return (
		<>
			<div className={styles.topMobileUI}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="1.5"
					stroke="currentColor"
					className={styles.bars}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
					/>
				</svg>
				<h1>birdspot</h1>

				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="1.5"
					stroke="currentColor"
					className={styles.bars}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
					/>
				</svg>
			</div>
			<div className={styles.mobileUI}>
				<div className={styles.birds}>
					<Icon path={mdiBird} size={1.5} />
				</div>
			</div>
		</>
	);
}
