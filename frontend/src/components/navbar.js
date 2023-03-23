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

// https://flowbite.com/docs/components/sidebar/
export default function Navbar() {
	return (
		<div>
			<aside id="default-sidebar"
				   class="fixed top-0 left-0 z-40 w-64 h-screen"
				   aria-label="Sidebar">
				<div class="h-full px-3 py-4 overflow-y-auto bg-gray-50">

					<ul class="space-y-2">
						<li>
							<span class="ml-3">Menu</span>
						</li>
						<li>
							<a href="#"
							   className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 ">
								<FontAwesomeIcon icon={faGrip} className="flex-shrink-0 w-6 h-6 text-gray-500 group-hover:text-gray-900"/>
								<span class="ml-3">Dashboard</span>
							</a>
						</li>
						<li>
							<a href="#"
							   className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 ">
								<FontAwesomeIcon icon={faCalendarWeek} className="flex-shrink-0 w-6 h-6 text-gray-500 group-hover:text-gray-900"/>
								<span class="flex-1 ml-3 whitespace-nowrap">Planning</span>
								<span
									class="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full ">Pro</span>
							</a>
						</li>
						<li>
							<a href="#"
							   className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 ">
								<FontAwesomeIcon icon={faCirclePlus} className="flex-shrink-0 w-6 h-6 text-gray-500 group-hover:text-gray-900"/>
								<span class="flex-1 ml-3 whitespace-nowrap">Nieuwe Data</span>
							</a>
						</li>
					</ul>


					<ul class="space-y-2">
						<li>
							<span class="ml-3">Data</span>
						</li>
						<li>
							<a href="#"
							   className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 ">
								<FontAwesomeIcon icon={faBicycle} className="flex-shrink-0 w-6 h-6 text-gray-500 group-hover:text-gray-900"/>
								<span class="flex-1 ml-3 whitespace-nowrap">Rondes</span>
							</a>
						</li>
						<li>
							<a href="#"
							   className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 ">
								<FontAwesomeIcon icon={faBuilding} className="flex-shrink-0 w-6 h-6 text-gray-500 group-hover:text-gray-900"/>
								<span class="flex-1 ml-3 whitespace-nowrap">Gebouwen</span>
							</a>
						</li>
						<li>
							<a href="#"
							   className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
								<FontAwesomeIcon icon={faPeopleGroup} className="flex-shrink-0 w-6 h-6 text-gray-500 group-hover:text-gray-900"/>
								<span class="flex-1 ml-3 whitespace-nowrap">Personeel</span>
							</a>
						</li>
						<li>
							<a href="#"
							   className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
								<FontAwesomeIcon icon={faBriefcase} className="flex-shrink-0 w-6 h-6 text-gray-500 group-hover:text-gray-900"/>
								<span class="flex-1 ml-3 whitespace-nowrap">Syndici</span>
							</a>
						</li>
					</ul>


					<ul class="space-y-2">
						<li>
							<span class="ml-3">Communicatie</span>
						</li>
						<li>
							<a href="#"
							   className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 ">
								<FontAwesomeIcon icon={faEnvelope} className="flex-shrink-0 w-6 h-6 text-gray-500 group-hover:text-gray-900"/>
								<span class="flex-1 ml-3 whitespace-nowrap">Berichten</span>
								<span
									class="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">3</span>
							</a>
						</li>
						<li>
							<a href="#"
							   className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 ">
								<FontAwesomeIcon icon={faUserGroup} className="flex-shrink-0 w-6 h-6 text-gray-500 group-hover:text-gray-900"/>
								<span class="flex-1 ml-3 whitespace-nowrap">Groepen</span>
							</a>
						</li>
						<li>
							<a href="#"
							   className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 ">
								<FontAwesomeIcon icon={faEnvelopeOpenText} className="flex-shrink-0 w-6 h-6 text-gray-500 group-hover:text-gray-900"/>
								<span class="flex-1 ml-3 whitespace-nowrap">Templates</span>
							</a>
						</li>
					</ul>
				</div>
			</aside>
		</div>

	);
}
