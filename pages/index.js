import styles from "@/styles/accesspage.module.css";
import SignInForm from "@/components/AccessPage/SignInForm";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

export default function AccessPage() {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (session) {
			router.push("/dashboard");
		}
	}, [session, router]);

	if (session) {
		return null;
	}

	const controls = useAnimation();

	useEffect(() => {
		controls.start({
			x: 0,
			opacity: 1,
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
							duration: 1,
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
							duration: 0.5,
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
				<div className={styles.logo}> Cheep</div>
				<SignInForm />
			</div>
		</div>
	);
}

export async function getServerSideProps(context) {
	const session = await getSession(context);
	if (session) {
		return {
			redirect: {
				destination: "/dashboard",
				permanent: false,
			},
		};
	}

	return {
		props: {},
	};
}
