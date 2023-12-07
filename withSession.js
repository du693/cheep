import { getServerSession } from "next-auth/next";
import { authOptions } from "./pages/api/auth/[...nextauth]";
import { validationResult } from "express-validator";

const withSession = (handler) => async (req, res) => {
	// Input validation
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const session = await getServerSession(req, res, authOptions);

	if (!session) {
		// Not Signed in
		return res.status(401).end();
	}

	// If signed in and validation passes, call the original handler
	return handler(req, res);
};

export default withSession;
