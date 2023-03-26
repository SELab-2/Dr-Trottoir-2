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
import Link from 'next/link';


/**
 * Button component of the navbar.
 * @param tag The tag that needs to be displayed on the button.
 * @param icon The icon of the button.
 * @param link The link where the button needs to send the user.
 * @constructor
 */
function Navbar_button({tag, icon, link}) {
	return (
		<Link href={link}
		   className={"flex items-center p-2 text-base font-normal text-gray-200 rounded-lg hover:bg-accent-100 hover:text-gray-400"} >
			<FontAwesomeIcon icon={icon} className={"flex-shrink-0 w-6 h-6 ml-4"} />
			<span className="ml-3">{tag}</span>
		</Link>
	)
}

/**
 * Create a list for the navbar.
 * @param name Name of the categories.
 * @param categories: Dictionary where the keys are the different categories and the value the corresponding info.
 * 						Info includes the icon and the link.
 * @constructor
 */
function Navbar_List({name, categories}) {

	let new_cat =Object.entries(categories).map(function([category, info], i){
		return(
			<li key={category + i}>
				<Navbar_button tag={category} icon={info.icon} link={info.link} />
			</li>
		);
	})

	return (
		<ul className="space-y-2 mt-9">
			<li>
				<span className="ml-6 text-gray-100">{name}</span>
			</li>
			{new_cat}
		</ul>)
}

// https://flowbite.com/docs/components/sidebar/
export default function Navbar({user}) {
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
				<div className="h-full px-3 py-4 overflow-y-auto bg-gray-500">

					<div className={"flex justify-center w-full"}>
						<img src="/images/Logo-Dr-Trottoir-GEEL-01.png" alt="Logo Dr.Trottoir" className={"w-3/5"} />
					</div>

					<Navbar_List name={"Menu"} categories={
						{
							Dashboard: {icon: faGrip, link: "/admin/dashboard"},
							Planning: {icon: faCalendarWeek, link: "#"},
							'Nieuwe data' : {icon: faCirclePlus, link: "#"}
						}
					}/>

					<Navbar_List name={"Data"} categories={
						{
							Rondes: {icon: faBicycle, link: "#"},
							Gebouwen: {icon: faBuilding, link: "#"},
							Personeel : {icon: faPeopleGroup, link: "#"},
							Syndici: {icon: faBriefcase, link: "#"}
						}
					}/>

					<Navbar_List name={"Communicatie"} categories={
						{
							Berichten: {icon: faEnvelope, link: "#"},
							Groepen: {icon: faUserGroup, link: "#"},
							Templates : {icon: faEnvelopeOpenText, link: "#"}
						}
					}/>

					{user && (
						<div className={"flex bottom-0 left-0 absolute p-6 w-full"}>

							<div style={styles.pict}></div>

							<div className={"flex flex-col justify-center ml-6"}>
								<p className={"text-gray-100"}>{user.first_name}</p>
								<p className={"text-gray-100"}>{user.last_name}</p>
							</div>

						</div>
					)}

				</div>
			</aside>
		</div>

	);
}
