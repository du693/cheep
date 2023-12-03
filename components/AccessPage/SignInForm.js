import Image from "next/image";
import { signIn } from "next-auth/react";
import styles from "./signinform.module.css";

import googleLogo from "@/public/google.png";
import githubLogo from "@/public/github.png";
import { useState } from "react";
import linkedinLogo from "@/public/linkedin.png";
import { useRouter } from "next/router";

export default function SignInForm({ children }) {
	const router = useRouter();

	const { error } = router.query;

	const handleSignIn = (provider) => {
		signIn(provider);
	};

	return (
		<div className={styles.signInForm}>
			<div className={styles.socialProviders}>
				<div>
					<button
						className={`${styles.button1} ${styles.linkedin}`}
						onClick={() => handleSignIn("linkedin")}
					>
						<span>Continue with Linkedin</span>
						<Image
							src={linkedinLogo}
							alt="Google Logo"
							width={20}
							height={20}
						/>
					</button>
				</div>
				<div>
					<button
						className={`${styles.button1} ${styles.google}`}
						onClick={() => handleSignIn("google")}
					>
						<span>Continue with Google</span>
						<Image
							src={googleLogo}
							alt="Google Logo"
							width={20}
							height={20}
						/>
					</button>
				</div>
				<div>
					{" "}
					<button
						className={`${styles.button1} ${styles.github}`}
						onClick={() => handleSignIn("github")}
					>
						<span>Continue with Github</span>
						<Image
							src={githubLogo}
							alt="Google Logo"
							width={20}
							height={20}
						/>
					</button>
				</div>
			</div>
		</div>
	);
}