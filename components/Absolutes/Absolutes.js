import AddSpot from "./AddSpot";
import CheepLogo from "./CheepLogo";
import UserSection from "../Controls/UserSection";

export default function Absolutes({ isOpen, toggleSection, session }) {
	return (
		<>
			<UserSection
				isOpen={isOpen}
				toggleSection={toggleSection}
				session={session}
			/>
		</>
	);
}
