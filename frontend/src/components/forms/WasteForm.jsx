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

export default function WasteForm() {
  const [loading, setLoading] = useState(true);
  const [loadSchedule, setLoadSchedule] = useState(false);
  const router = useRouter();

  const [selectedTour, setSelectedTour] = useState("");
  const [allTours, setAllTours] = useState([]);
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
    router.reload();
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setAllTours(await TourService.get());
    }

    fetchData()
      .then(() => setLoading(false))
      .catch();
  }, []);

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
        <SelectForm
          id={"tour"}
          label={"Ronde"}
          onChange={(tour) => handleTourSelect(tour.target.value)}
          className={"flex-1"}
          value={selectedTour}
        >
          {allTours.map((tour, index) => {
            return (
              <option key={tour.url} value={tour.url}>
                {tour.name}
              </option>
            );
          })}
        </SelectForm>
      </div>

      <label className={"font-bold"}> {"Kalender"} </label>
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
    </BasicForm>
  );
}
