import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faBicycle,
	faBriefcase,
	faBuilding,
	faEnvelopeOpenText,
	faEnvelope,
	faGrip,
	faUserGroup,
	faPeopleGroup,
	faCalendarWeek,
	faCirclePlus,
} from '@fortawesome/free-solid-svg-icons'

function Navbar_button({tag, icon, link}) {
	return (
		<a href={link}
		   className="flex items-center p-2 text-base font-normal text-gray-500 rounded-lg hover:bg-[#E6E600] hover:text-gray-900 " >
			<FontAwesomeIcon icon={icon} className="flex-shrink-0 w-6 h-6 ml-4 text-gray-500 group-hover:text-gray-900 hover:text-gray-900 "/>
			<span className="ml-3">{tag}</span>
		</a>
	)
}

// https://flowbite.com/docs/components/sidebar/
export default function Navbar() {
	const styles = {
		pict: {
			width: '50px',
			height: '50px',
			borderRadius: '50%',
			backgroundColor: 'blue'
		}
	}

	return (
		<div>
			<aside id="default-sidebar"
				   className="fixed top-0 left-0 z-40 w-72 h-screen"
				   aria-label="Sidebar">
				<div className="h-full px-3 py-4 overflow-y-auto bg-gray-50">

					<ul className="space-y-2 mt-9">
						<li>
							<span className="ml-6">Menu</span>
						</li>
						<li>
							<Navbar_button tag={"Dashboard"} icon={faGrip} link={"#"} />
						</li>
						<li>
							<Navbar_button tag={"Planning"} icon={faCalendarWeek} link={"#"} />
						</li>
						<li>
							<Navbar_button tag={"Nieuwe Data"} icon={faCirclePlus} link={"#"} />
						</li>
					</ul>


					<ul className="space-y-2 mt-9">
						<li>
							<span className="ml-6">Data</span>
						</li>
						<li>
							<Navbar_button tag={"Rondes"} icon={faBicycle} link={"#"} />
						</li>
						<li>
							<Navbar_button tag={"Gebouwen"} icon={faBuilding} link={"#"} />
						</li>
						<li>
							<Navbar_button tag={"Personeel"} icon={faPeopleGroup} link={"#"} />
						</li>
						<li>
							<Navbar_button tag={"Syndici"} icon={faBriefcase} link={"#"} />
						</li>
					</ul>


					<ul className="space-y-2 mt-9">
						<li>
							<span className="ml-6">Communicatie</span>
						</li>
						<li>
							<Navbar_button tag={"Nieuwe Data"} icon={faCirclePlus} link={"#"} />
						</li>
						<li>
							<Navbar_button tag={"Groepen"} icon={faUserGroup} link={"#"} />
						</li>
						<li>
							<Navbar_button tag={"Templates"} icon={faEnvelopeOpenText} link={"#"} />
						</li>
					</ul>

					<div className={"flex bottom-0 left-0 absolute p-6 w-full"}>

						<div style={styles.pict}></div>

						<div class={"flex flex-col justify-center ml-6"}>
							<p>Voornaam</p>
							<p>Achternaam</p>
						</div>

					</div>


				</div>
			</aside>
		</div>

	);
}
