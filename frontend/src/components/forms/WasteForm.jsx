import SelectForm from "@/components/forms/forms-components/forms-input/SelectForm";
import BasicForm from "@/components/forms/BasicForm";
import Loading from "@/components/Loading";
import TourService from "@/services/tour.service";
import { urlToPK } from "@/utils/urlToPK";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SecondaryCard from "../custom-card/SecondaryCard";
import BuildingService from "@/services/building.service";
import TableWasteSchedule from "./forms-components/forms-input/TableWasteSchedule";
import CustomWeekPicker from "../input-fields/CustomWeekPicker";
import moment from "moment";
import wasteService from "@/services/waste.service";
import InputForm from "./forms-components/forms-input/InputForm";
import Dropdown from "../Dropdown";

export default function WasteForm() {
  const [loading, setLoading] = useState(true);
  const [loadSchedule, setLoadSchedule] = useState(false);
  const router = useRouter();

  const [selectedTour, setSelectedTour] = useState("");
  const [allTours, setAllTours] = useState([]);
  const [tourBuildings2, setTourBuildings2] = useState({});
  const [tourBuildings, setTourBuildings] = useState([]);
  const [waste, setWaste] = useState([]);
  const [changedWaste, setChangedWaste] = useState({});
  const [week, setWeek] = useState([
    moment().startOf("isoWeek").toDate(),
    moment().endOf("isoWeek").toDate(),
  ]);
  const [weekCopy, setWeekCopy] = useState(0);

  const onSubmit = async (event) => {
    setLoadSchedule(true);
    console.log("hierzo");
    event.preventDefault();
    for (const building in changedWaste) {
      for (const date in changedWaste[building]) {
        for (const type in changedWaste[building][date]) {
          const [newState, timesChanged] = changedWaste[building][date][type];
          let state = newState === 2 ? "Buiten" : "Binnen";

          const wasteEntries = Object.values(waste[building] || {});
          const matchingEntry = wasteEntries.find(
            (entry) => entry.date === date && entry.waste_type === type
          );

          if (newState === 0) {
            // delete entry
            if (matchingEntry) {
              await wasteService.deleteByUrl(matchingEntry.url);
            }
          } else if (newState === timesChanged) {
            // create entry
            const data = {
              date,
              waste_type: type,
              building,
              action: state,
            };
            await wasteService.post(data);
            console.log(
              `You have submitted the form. 
              The data you want to submit is: ${JSON.stringify(data)}`
            );
          } else if (newState !== timesChanged) {
            // update entry
            if (matchingEntry) {
              const data = { action: state };
              await wasteService.patchByUrl(matchingEntry.url, data);
            }
          }
        }
      }
    }

    // copy weeks for following 100 days
    if (weekCopy > 0) {
      // first delete every waste entry in the weeks you want to replace
      await Promise.all(
        tourBuildings.map(async (building) => {
          for (let i = 1; weekCopy * i * 7 < 100; i++) {
            const monday = moment(week[0])
              .add(weekCopy * i, "weeks")
              .toDate();
            const sunday = moment(week[1])
              .add(weekCopy * i, "weeks")
              .toDate();
            const wasteEntries = await wasteService.get({
              startDate: monday,
              endDate: sunday,
              building: building.building.url,
            });
            await Promise.all(
              wasteEntries.map(async (wasteEntry) => {
                await wasteService.deleteByUrl(wasteEntry.url);
              })
            );
          }
        })
      );

      // add the copies
      await Promise.all(
        tourBuildings.map(async (building) => {
          const wasteEntries = await wasteService.get({
            startDate: week[0],
            endDate: week[1],
            building: building.building.url,
          });

          const promises = wasteEntries.flatMap((wasteEntry) => {
            const newEntries = [];

            for (let i = 1; weekCopy * i * 7 < 100; i++) {
              const newDate = moment(wasteEntry.date)
                .add(1, "days")
                .add(i * weekCopy, "weeks")
                .toDate()
                .toISOString()
                .substring(0, 10);

              const newEntryPromise = wasteService.post({
                date: newDate,
                action: wasteEntry.action,
                building: wasteEntry.building,
                waste_type: wasteEntry.waste_type,
              });

              newEntries.push(newEntryPromise);
            }

            return newEntries;
          });

          await Promise.all(promises);
        })
      );
    }

    setLoadSchedule(false);
    //router.reload();
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setAllTours(await TourService.get());
    } 

    fetchData()
      .catch();
  }, []);

  useEffect(() => {
    async function fetchWaste() {
      const wasteSchedule = await wasteService.get({
        startDate: week[0],
        endDate: week[1],
      });
      setWaste(wasteSchedule);
    }

    // TO DO: check this
    fetchWaste()
      .then(() => setLoading(false))
      .catch();
  }, [week]);


  if (loading) {
    return (
      <div className={"flex justify-center items-center h-fit w-full"}>
        <Loading className={"w-10 h-10"} />
      </div>
    );
  }

  const getWasteSchedule = async (startDate, endDate, buildings) => {
    const wasteSchedule = {};
    await Promise.all(
      buildings.map(async (building) => {
        wasteSchedule[building.building.url] = await wasteService.get({
          startDate: startDate,
          endDate: endDate,
          building: building.building.url,
        });
      })
    );
    setWaste(wasteSchedule);
  };

  const handleTourSelect = async (tour) => {
    setLoadSchedule(true);
    setSelectedTour(tour);
    const buildingsInTour = await TourService.getBuildingsFromTour(
      urlToPK(tour)
    );
    const fixedFormat = await Promise.all(
      buildingsInTour.map(async (buildingInTour) => ({
        building: await BuildingService.getEntryByUrl(buildingInTour.building),
        order_index: buildingInTour.order_index,
      }))
    );
    const sorted = fixedFormat.sort((a, b) => a.order_index - b.order_index);
    await getWasteSchedule(week[0], week[1], sorted);
    setTourBuildings(sorted);
    setLoadSchedule(false);
  };

  const changeWeek = async (dateFrom, dateTo) => {
    setLoadSchedule(true);
    setWeek([dateFrom, dateTo]);
    if (tourBuildings.length > 0) {
      await getWasteSchedule(dateFrom, dateTo, tourBuildings);
    }
    setLoadSchedule(false);
  };

  const changeTours = async (tours) => {
    console.log("hello");
    setLoadSchedule(true);
    const updatedTourBuildings = {};

    tours.forEach(async (tour) => {
      const tourUrl = tour[1].url;
      if (tourUrl in tourBuildings2) {
        updatedTourBuildings[tourUrl] = tourBuildings2[tourUrl];
      } else {
        const buildingsInTour = await TourService.getBuildingsFromTour(
          urlToPK(tourUrl)
        );
        const fixedFormat = await Promise.all(
          buildingsInTour.map(async (buildingInTour) => ({
            building: await BuildingService.getEntryByUrl(buildingInTour.building),
            order_index: buildingInTour.order_index,
          }))
        );
        const sorted = fixedFormat.sort((a, b) => a.order_index - b.order_index);
        const buildingsWaste = sorted.reduce((dict, building) => {
          const filteredWaste = waste.filter((w) => w.building === building.building.url);
          dict[building.building.url] = filteredWaste;
          return dict;
        }, {});
        updatedTourBuildings[tourUrl] = [sorted, buildingsWaste];
      }
    });
    setTourBuildings2(updatedTourBuildings);
    setLoadSchedule(false);
  };

  return (
    <BasicForm
      loading={loading}
      onSubmit={onSubmit}
      model={"planning"}
      className={"space-y-2"}
    >
      <div className="flex space-x-2">
        <div className="space-y-2 flex-1">
          <label className={"font-bold"}> {"Week"} </label>
          <CustomWeekPicker
            startDate={week[0]}
            endDate={week[1]}
            className={"w-full"}
            onChange={changeWeek}
          />
        </div>
        <Dropdown
          multi={true}
          options={allTours.map((tour) => tour.name)}
          optionsValues={allTours}
          onClick={changeTours}
        >
          <p>Rondes</p>
        </Dropdown>
      </div>
      <label className={"font-bold"}> {"Kalender"} </label>
      { loadSchedule ? (
        <div className={"flex justify-center items-center h-fit w-full"}>
          <Loading className={"w-10 h-10"} />
        </div>
      ) : (
        Object.entries(tourBuildings2).map(([tourUrl, buildings]) => (
          <SecondaryCard key={tourUrl}>
            {console.log(buildings)}
            <label>{tourUrl}</label>
            <TableWasteSchedule
              buildings={buildings[0]}
              wasteSchedule={buildings[1]}
              startDate={week[0]}
              onChange={setChangedWaste}
            ></TableWasteSchedule>
          </SecondaryCard>
        ))
      )}
      
      {/*
      <SecondaryCard>
        {!loadSchedule ? (
          tourBuildings.length === 0 ? (
            <p>Selecteer een ronde</p>
          ) : (
            <>
              <SecondaryCard className={"!pl-0"}>
                <TableWasteSchedule
                  buildings={tourBuildings}
                  wasteSchedule={waste}
                  startDate={week[0]}
                  onChange={setChangedWaste}
                ></TableWasteSchedule>
              </SecondaryCard>
              <div className="flex space-x-2 items-center">
                <p>Voeg deze weekkalender toe om de </p>
                <InputForm
                  id={"repetition"}
                  type={"number"}
                  value={weekCopy}
                  className={"w-16 !space-y-0"}
                  onChange={(e) => setWeekCopy(e.target.value)}
                />
                <p> weken.</p>
              </div>
            </>
          )
        ) : (
          <div className={"flex justify-center items-center h-fit w-full"}>
            <Loading className={"w-10 h-10"} />
          </div>
        )}
      </SecondaryCard>
        */}
    </BasicForm>
  );
}
