import { useRouter } from "next/router";

const ErrorPage = () => {
	const router = useRouter();
	const { error } = router.query;

	return <div>{error && <p>{decodeURIComponent(error)}</p>}</div>;
};
