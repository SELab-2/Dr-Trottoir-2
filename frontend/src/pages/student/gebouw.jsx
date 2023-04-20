import MobileLayout from "@/components/MobileLayout";
import buildingService from "@/services/building.service";
import { useEffect, useState } from "react";
import { faBuilding, faLocationDot, faBriefcase, faImage } from "@fortawesome/free-solid-svg-icons";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import SecondaryCard from "@/components/custom-card/SecondaryCard";
import Dropdown from "@/components/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CustomButton from "@/components/button/Button";

export default function StudentBuilding() {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  useEffect(() => {
    async function fetchBuildings() {
      const response = await buildingService.get();
      console.log(response)
      setBuildings(response);
    }
    fetchBuildings()
  }, []);  

  // Needs to change because nicknames aren't unique
  const changeBuilding = (selected) => {
    if (selected.length == 0){
      setSelectedBuilding(null);
    } else {
      const nicknameSelected = selected[0];
      setSelectedBuilding(buildings.find(building => building.nickname == nicknameSelected));
    }
    
  };

  return (
    <>
      <div className="w-full p-2">
        <Dropdown 
          icon={faBuilding} 
          options={buildings.map(building => building.nickname)}
          onClick={changeBuilding}
        >
          {selectedBuilding == null ?  
            <div>Selecteer een gebouw</div> : <div>{selectedBuilding.nickname}</div>  }
        </Dropdown>
        
        {selectedBuilding !== null &&
          <div> 
          <PrimaryCard className="m-1"> 
            <div>
              <div className="flex items-center">
                <div className="font-bold text-lg text-light-h-1">
                  {selectedBuilding.nickname} 
                </div>
                <div className="ml-auto">
                  <CustomButton className="-p-2">Handleiding</CustomButton>
                </div>
                
              </div>
              <div className="flex text-light-h-1 items-center">
                <FontAwesomeIcon icon={faLocationDot} className="pr-2"/>
                <div>{selectedBuilding.address_line_1}</div>
                <div className="ml-auto">{selectedBuilding.address_line_2}</div>
                
              </div>
            </div>
            <SecondaryCard className="my-3"></SecondaryCard>
            <SecondaryCard title="Opmerkingen" icon={faBriefcase} className="my-3">

            </SecondaryCard>
            <SecondaryCard title="Foto's" icon={faImage} className="my-2">
              <PrimaryCard title="Binnen" className="my-2"></PrimaryCard>
              <PrimaryCard title="Lokaal" className="my-2"></PrimaryCard>
              <PrimaryCard title="Vertrek" className="my-2"></PrimaryCard>
            </SecondaryCard>
          </PrimaryCard>
          </div>
        }
        

        
      </div>
    </>
  );
}

StudentBuilding.getLayout = function getLayout(page) {
  return <MobileLayout>{page}</MobileLayout>;
};
