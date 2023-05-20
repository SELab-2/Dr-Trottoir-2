import BasicCopyModal from "@/components/forms/forms-copy-modal/BasicCopyModal";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import ScheduleService from "@/services/schedule.service";
import CustomDayPicker from "@/components/input-fields/CustomDayPicker";
import moment from "moment";

export default function ScheduleCopyModal({ open, onCloseModal }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [date, setDate] = useState(moment());

  const [error, setError] = useState("");

  const onCopy = async () => {
    try {
      const postData = {
        student: data.student,
        tour: data.tour,
        date: moment(date).format("YYYY-MM-DD"),
      };
      await ScheduleService.post(postData);
      onCloseModal();
      router.reload();
      setError("");
    } catch (e) {
      setError(JSON.stringify(e.response.data));
    }
  };

  useEffect(() => {
    setLoading(true);

    // fetch all the data needed for the page
    async function fetchData() {
      if (router.query.id) {
        const data = await ScheduleService.getById(router.query.id);
        setData(data);
        setDate(moment(data.date).add(1, "days"));
      }
    }

    fetchData().then(() => setLoading(false));
  }, [router.query.id]);

  return (
    <BasicCopyModal
      error={error}
      onCancel={onCloseModal}
      onCopy={onCopy}
      open={open}
      loading={loading}
    >
      {loading ? (
        <div className={"flex justify-center items-center h-fit w-full"}>
          <Loading className={"w-10 h-10"} />
        </div>
      ) : (
        <div>
          <p className={"font-bold"}> {"Datum"} </p>
          <CustomDayPicker
            date={date.toDate()}
            className={"w-full"}
            onChange={(date) => setData(date)}
          />
        </div>
      )}
    </BasicCopyModal>
  );
}
