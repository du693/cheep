import Image from "next/image";
import { signIn } from "next-auth/react";
import styles from "./signinform.module.css";

import googleLogo from "@/public/google.png";
import githubLogo from "@/public/github.png";
import linkedinLogo from "@/public/linkedin.png";
import { useRouter } from "next/router";

export default function SignInForm({ children }) {
	const router = useRouter();
	const { error } = router.query;

	const handleGoogleClick = () => {
		signIn("google");
	};
	const handleGithubClick = () => {
		signIn("github");
	};
	const handleLinkedinClick = () => {
		signIn("linkedin");
	};

	return (
		<div className={styles.signInForm}>
			<div>
				{error && <p className="error">{error}</p>}
				{/* Sign-in form */}
			</div>
			<div className={styles.socialProviders}>
				<div>
					{" "}
					<button
						className={styles.button1}
						onClick={handleLinkedinClick}
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
						className={styles.button1}
						onClick={handleGoogleClick}
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
					<button
						className={styles.button1}
						onClick={handleGithubClick}
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
