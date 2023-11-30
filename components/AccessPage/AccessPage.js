import { signIn } from "next-auth/react";
import styles from "./accesspage.module.css";
import SignInForm from "./SignInForm";
// import landingImage from "@/public/landingImg.png";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useState } from "react";
import { useEffect } from "react";
import { GoogleSignInButton } from "../AuthComponents/authButtons";

export default function AccessPage() {
	const [isVisible, setIsVisible] = useState(null);

	const controls = useAnimation();

	useEffect(() => {
		// Start the animation when the component mounts
		controls.start({
			x: 0, // Set the initial position
			opacity: 1, // Set the initial opacity
			transition: {
				ease: "linear",
				duration: 2,
				x: { duration: 1 },
			},
		});
	}, []);

	return (
		<div className={styles.accesspage}>
			<div className={styles.landingImageBox}>
				{/* <Image
					src={landingImage}
					priority
					className={styles.landingImage}
					alt="landing image"
				/> */}
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{
						duration: 1,
						ease: [0, 0.71, 0.2, 1.01],
						scale: {
							type: "spring",
							damping: 5,
							stiffness: 10,
							restDelta: 0.001,
						},
					}}
					className={styles.Text}
				>
					<motion.div
						className={styles.pitch}
						whileHover={{ scale: 1.01 }}
						transition={{
							duration: 1, // Increase the duration to make it slower (in seconds)
						}}
					>
						<h2>
							<b className={styles.highlight}>Explore</b> the
							birds in your area and{" "}
							<b className={styles.highlight}>contribute</b> to a
							growing community of observers.
						</h2>
					</motion.div>
					<motion.div
						className={styles.cheepDescription}
						whileHover={{ scale: 1.01 }}
						transition={{
							duration: 0.5, // Increase the duration to make it slower (in seconds)
						}}
					>
						<p>
							With Cheep, you can document your sightings and view
							a detailed map filled with contributions from users
							all over New England. Ideal for both casual bird
							enthusiasts and serious birdwatchers, our app offers
							a clear and concise platform for tracking and
							sharing avian sightings. Dive in and enrich our
							collective understanding of local bird populations.
							Join today and contribute to a comprehensive bird
							spotting network.
						</p>
					</motion.div>
				</motion.div>
			</div>
			<div className={styles.sign}>
				<SignInForm />
			</div>
		</div>
	);
}
