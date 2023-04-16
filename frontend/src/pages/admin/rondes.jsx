import Head from "next/head";
import SecondaryButton from "@/components/button/SecondaryButton";
import CustomInputField from "@/components/input-fields/InputField";
import {
  faCirclePlus,
  faMagnifyingGlass,
  faFilter,
  faSort,
  faTrash,
  faBan,
  faBriefcase,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import PrimaryButton from "@/components/button/PrimaryButton";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import SelectionList from "@/components/selection/SelectionList";
import { useEffect, useState } from "react";
import TourService from "@/services/tour.service";
import BuildingInTourService from "@/services/buildingInTour.service";
import VisitService from "@/services/visit.service";
import CustomProgressBar from "@/components/ProgressBar";
import CustomWeekPicker from "@/components/input-fields/CustomWeekPicker";
import SecondaryCard from "@/components/custom-card/SecondaryCard";
import { useRouter } from "next/router";
import ScheduleService from "@/services/schedule.service";

function SmallTour({ data, callback, setSelected, background }) {
  const url = data["url"];
  let name = "";
  let amount = 1;
  let finished = 0;
  if (data !== undefined) {
    name = data["name"];
    if (data["amount"] > 0) {
      amount = data["amount"];
    }
    finished = data["finished"];
  }
  function handleClick() {
    setSelected(url);
    callback();
  }

  return (
    <div
      data-testid="small-tour"
      className={"p-4 rounded-lg space-y-3 cursor-pointer"}
      style={{ backgroundColor: background }}
      onClick={handleClick}
    >
      <h1 className={"font-semibold"}>{name}</h1>
      <CustomProgressBar fraction={finished / amount} />
    </div>
  );
}

export default function AdminTourPage() {
  const [response, setResponse] = useState("{}");
  const [tours, setTours] = useState([]);
  const planning = useRouter().query["planning"];
  console.log(planning)
  useEffect(() => {
    const allTours = async () => {
      console.log(planning);
      if (planning !== undefined) {
        const scheduleResponse = await ScheduleService.getSchedule(planning);
        //const userId = scheduleResponse["student"].split("/").pop();
        console.log(scheduleResponse);
        //console.log(userId);
        const response = await TourService.getAll();
        //setTours(JSON.stringify(response, null, 2))
        const btResponse = await BuildingInTourService.getAll();
        const visitResponse = await VisitService.getAll();
        const tour = [];

        if (
          response.hasOwnProperty("results") &&
          btResponse.hasOwnProperty("results") &&
          visitResponse.hasOwnProperty("results")
        ) {
          const list = response["results"];
          const visits = visitResponse["results"].map(
            (entry) => entry["building_in_tour"]
          );
          console.log(visits);

          for (let i in list) {
            let finished = 0;
            const entry = list[i];
            const url = entry["url"];
            const buildings = btResponse["results"]
              .filter((entry) => entry["tour"] === url)
              .map((entry) => entry["url"]);
            for (let i = 0; i < buildings.length; i++) {
              for (let j = 0; j < visits.length; j++) {
                if (visits[j] === buildings[i]) {
                  finished++;
                }
              }
            }
            tour.push({
              url: url,
              name: entry["name"],
              amount: buildings.length,
              finished: finished,
            });
          }
        }
        setTours(tour);
      }
    };
    allTours().catch();
  }, []);

  return (
    <>
      <Head>
        <title>Rondes</title>
      </Head>
      <div className={"h-full bg-light-bg-2 flex flex-col py-6 px-3 space-y-4"}>
        <div className={"h-full bg-light-bg-2 flex flex-row space-x-2"}>
          <PrimaryCard className={"w-9/12 h-full"} title={"Details"}>
            <div className={"flex flex-col space-y-4"}>
              <h1 className={"text-light-h-1 font-bold text-lg"}>
                Stations Ronde
              </h1>
              <div className={"flex flex-row space-x-2"}>
                <div className={"flex flex-col space-y-2"}>
                  <SecondaryCard
                    icon={faBriefcase}
                    title={"Aangeduide student"}
                  >
                    <p>It's ya boi TIM</p>
                  </SecondaryCard>
                  <SecondaryCard icon={faBriefcase} title={"Progress"}>
                    <div
                      className={"flex flex-row items-center justify-center"}
                    >
                      <CustomProgressBar
                        is_wheel
                        circleWidth={120}
                        radius={40}
                        className={"flex-shrink w-1/6 h-1/6"}
                        fraction={1 / 6}
                      />
                      <h1 className={"text-light-h-1 font-bold text-base"}>
                        1/6 Gebouwen klaar
                      </h1>
                    </div>
                  </SecondaryCard>
                </div>

                <SecondaryCard icon={faLocationDot} title={"Opmerkingen"}>
                  <p>The gift card is shattered</p>
                </SecondaryCard>

                <SecondaryCard icon={faLocationDot} title={"Wegbeschrijving"}>
                  <p>The gift card is shattered</p>
                </SecondaryCard>
              </div>
              <SecondaryCard icon={faBriefcase} title={"Gebouwen"}>
                <p>TABLE</p>
              </SecondaryCard>
            </div>
          </PrimaryCard>

          <div
            className={"bg-light-bg-2 flex w-3/12 flex-col space-y-2 h-full"}
          >
            <div className={"flex flex-row"}>
              <CustomWeekPicker />
              <PrimaryButton icon={faCirclePlus}>Nieuw</PrimaryButton>
            </div>
            <SelectionList
              Component={({ url, background, setSelected, callback, data }) => (
                <SmallTour
                  key={url}
                  background={background}
                  setSelected={setSelected}
                  callback={callback}
                  data={data}
                />
              )}
              title={"Rondes"}
              callback={() => {
                console.log("callback is called!");
              }}
              elements={tours}
            />
          </div>
        </div>
      </div>
    </>
  );
}
/*
// NOTE(Elias): DO NOT DELETE! This was testing code and will be reused later in the development of this page.

import {useEffect, useState} from "@types/react";
import {TourService} from "@/services/tour.services";
import {BuildingInTourService} from "@/services/buildingInTour.service";
import {VisitService} from "@/services/visit.service";

const [response, setResponse] = useState('{}');
const [tours, setTours] = useState([]);

useEffect(  () => {
    const allTours = async () => {
        const response = await TourService.getAll()
        //setTours(JSON.stringify(response, null, 2))
        const btResponse = await BuildingInTourService.getAll()
        const visitResponse = await VisitService.getAll()
        const tour = []

        if (response.hasOwnProperty("results") && btResponse.hasOwnProperty("results") && visitResponse.hasOwnProperty("results")){
            const list = response["results"]
            const visits = visitResponse["results"].map((entry) => entry["building_in_tour"])
            console.log(visits)

            for(let i in list){
                let finished = 0
                const entry = list[i]
                const url = entry["url"]
                const buildings = btResponse["results"].filter((entry) => entry["tour"] === url).map((entry) => entry["url"])
                for(let i = 0; i < buildings.length; i++){
                    for (let j = 0; j < visits.length; j++) {
                        if ( visits[j] === buildings[i]){
                            finished++
                        }
                    }
                }
                tour.push({"url": url, "name": entry["name"], "amount": buildings.length, "finished": finished})
            }
        }
        setTours(tour)
    }
    allTours().catch()
},[]);

import CustomProgressBar from "@/components/ProgressBar";

export default function SmallTour({ data, callback, setSelected, background }) {
    const url = data["url"];
    let name = "";
    let amount = 1;
    let finished = 0;
    if (data !== undefined) {
        console.log(data["name"]);
        console.log(data);
        name = data["name"];
        if (data["amount"] > 0) {
            amount = data["amount"];
        }
        finished = data["finished"];
    }

    function handleClick() {
        setSelected(url);
        callback();
    }

    return (
        <div
            data-testid="small-tour"
            className={"p-4 rounded-lg space-y-3 cursor-pointer"}
            style={{ backgroundColor: background }}
            onClick={handleClick}
        >
            <h1 className={"font-semibold"}>{name}</h1>
            <CustomProgressBar finishedCount={finished} amount={amount} />
        </div>
    );
}

import SmallTour from "@/components/SmallTour";
import SelectionList from "@/components/SelectionList";

<SelectionList
						Component={({url, background, setSelected, callback, data}) => (<SmallTour key={url} background={background} setSelected={setSelected} callback={callback} data={data}/>)}
						title={"Rondes"}
						callback={() => {console.log("callback is called!")}}
						elements={tours}
					/>
*/
