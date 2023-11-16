import Image from "next/image";
import styles from "./header.module.css";
import CHEEPLOGO from "@/public/CHEEPLOGO.png";
export default function Header() {
	return (
		<div className={styles.navbar}>
			<div className={styles.headerLeft}>
				<Image
					src={CHEEPLOGO}
					className={styles.cheepLogo}
					width={200}
					priority
					alt="Logo"
				></Image>
			</div>
			<div className={styles.headerMiddle}>
				<h1>cheep bird watching</h1>
			</div>
			<div className={styles.headerRight}>
				{" "}
				<div className={styles.link}>
					<p>repo</p>
				</div>
				<p>•</p>
				<div className={styles.link}>
					<p>linkedin</p>
				</div>
				<p>•</p>
				<div className={styles.link}>
					<p>acknowledgments</p>
				</div>
			</div>
		</div>
	);
}
