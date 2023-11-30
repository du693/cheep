import AddSpot from "./AddSpot";
import CheepLogo from "./CheepLogo";
import GlobalOrUser from "./GlobalOrUser";

export default function Absolutes({ globalIsOn, openSection, toggleSwitch }) {
	return (
		<>
			<AddSpot openSection={openSection} />
			<CheepLogo />
			<GlobalOrUser globalIsOn={globalIsOn} toggleSwitch={toggleSwitch} />
		</>
	);
}
