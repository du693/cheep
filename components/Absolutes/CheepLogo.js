import styles from "./cheeplogo.module.css";
import { signOut } from "next-auth/react";
import Cookies from "js-cookie";
export default function CheepLogo() {
	const handleSignOut = () => {
		// Clear the username cookie
		Cookies.remove("username");

		// Sign out using next-auth
		signOut();
	};

	return (
		<h1 className={styles.logo}>
			<b onClick={() => handleSignOut()}>cheep.</b>
		</h1>
	);
}
