import CheepLogo from "./CheepLogo";
import AddSpot from "./AddSpot";
import GlobalOrUser from "./GlobalOrUser";
import YourFormComponent from "./BasicForm";

export default function Absolutes({ globalIsOn, openSection, toggleSwitch }) {
	return (
		<>
			<CheepLogo />
			<AddSpot openSection={openSection} />
			<GlobalOrUser globalIsOn={globalIsOn} toggleSwitch={toggleSwitch} />
			<YourFormComponent />
		</>
	);
}
