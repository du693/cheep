import { getServerSession } from "next-auth/next";
import { authOptions } from "./pages/api/auth/[...nextauth]";

const withSession = (handler) => async (req, res) => {
	const session = await getServerSession(req, res, authOptions);

	if (!session) {
		// Not Signed in
		return res.status(401).end();
	}

	// If signed in, call the original handler
	return handler(req, res);
};

export default withSession;
