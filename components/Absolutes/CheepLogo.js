import styles from "./cheeplogo.module.css";
import { signOut } from "next-auth/react";
export default function CheepLogo() {
	return (
		<h1 className={styles.logo}>
			<b onClick={() => signOut()}>cheep.</b>
		</h1>
	);
}
