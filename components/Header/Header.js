import Image from "next/image";
import styles from "./header.module.css";
import { signOut } from "next-auth/react";
import Cookies from "js-cookie";
import { Username } from "@/context/Context";
import { useRouter } from "next/router";
import { useContext } from "react";

export default function Header({ session, openSection, toggleSection }) {
	const { username, setUsername } = useContext(Username);
	const router = useRouter();
	const handleSignOut = () => {
		// Clear the username cookie
		Cookies.remove("username");

		// Sign out using next-auth
		signOut();
	};

	const handleUserSectionClick = () => {
		router.push(`/user/${username}`);
	};
	return (
		<div className={styles.navbar}>
			<div className={styles.headerLeft}>
				<img
					src="/CHEEPLOGO.png"
					className={styles.cheepLogo}
					height={200}
					width={200}
					priority
					alt="Logo"
				/>
			</div>
			<div className={styles.headerMiddle}>
				<h1>Cheep Bird Watching</h1>
			</div>{" "}
			<div className={styles.headerRight}>
				<Image
					className={styles.sessionImage}
					src={session.user.image}
					alt="User Profile"
					width={50}
					height={50}
					onClick={() => handleUserSectionClick()}
				/>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className={styles.sessionImage}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
					/>
				</svg>{" "}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className={styles.sessionImage}
					onClick={() => handleSignOut()}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
					/>
				</svg>
			</div>
		</div>
	);
}
