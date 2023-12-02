import { useRouter } from "next/router";
import styles from "./error.module.css";
export default function Error() {
	const router = useRouter();
	const { error } = router.query; // Extract error message from query parameters

	return (
		<div className={styles.error}>
			<h2>Something went wrong!</h2>
			<p>{error}</p> {/* Display the error message */}
			<button
				className={styles.errorButton}
				onClick={() => router.push("/")}
			>
				Try again
			</button>
		</div>
	);
}
