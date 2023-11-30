"use client";

import { signIn } from "next-auth/react";

export function GoogleSignInButton() {
	const handleClick = () => {
		signIn("google");
	};

	return (
		<button onClick={handleClick}>
			<span>Continue with Google</span>
		</button>
	);
}

export function GithubSignInButton() {
	const handleClick = () => {
		signIn("github");
	};

	return (
		<button onClick={handleClick}>
			<span>Continue with Github</span>
		</button>
	);
}

export function CredentialsSignInButton() {
	const handleClick = () => {
		signIn();
	};

	return (
		<button onClick={handleClick}>
			{/* <Image src={githubLogo} alt="Github Logo" width={20} height={20} /> */}
			<span>Continue with Email</span>
		</button>
	);
}
