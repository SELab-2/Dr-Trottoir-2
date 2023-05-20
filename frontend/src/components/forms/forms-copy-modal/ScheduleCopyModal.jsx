import BasicCopyModal from "@/components/forms/forms-copy-modal/BasicCopyModal";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import RegionService from "@/services/region.service";
import Loading from "@/components/Loading";
import InputForm from "@/components/forms/forms-components/forms-input/InputForm";

export default function ScheduleCopyModal({ open, onCloseModal }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  // TODO: add states

  const [error, setError] = useState("");

  const onCopy = async () => {
    //TODO action on copy press
  };

  useEffect(() => {
    setLoading(true);

    // fetch all the data needed for the page
    async function fetchData() {
      if (router.query.id) {
        //TODO: fetch necessary data
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
        <p>TODO</p>
      )}
    </BasicCopyModal>
  );
}
