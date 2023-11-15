"use client";

import { signOut, useSession } from "next-auth/react";

export default function signIn() {
	const { data: session } = useSession();

	if (session && session.user) {
		<>
			<p>{session.user.name}</p>;
			<button onClick={() => signOut}>sign Out</button>
		</>;
	}

	return (
		<>
			<button onClick={() => signIn()}>sign in</button>
			<div>SigninButton</div>
		</>
	);
}
