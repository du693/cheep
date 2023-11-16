import AddSpot from "./AddSpot";
import GlobalOrUser from "./GlobalOrUser";

export default function Absolutes({ globalIsOn, openSection, toggleSwitch }) {
	return (
		<>
			<AddSpot openSection={openSection} />
			<GlobalOrUser globalIsOn={globalIsOn} toggleSwitch={toggleSwitch} />
		</>
	);
}
