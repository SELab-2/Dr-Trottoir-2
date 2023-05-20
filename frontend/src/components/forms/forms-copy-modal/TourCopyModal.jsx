import BasicCopyModal from "@/components/forms/forms-copy-modal/BasicCopyModal";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import InputForm from "@/components/forms/forms-components/forms-input/InputForm";
import TourService from "@/services/tour.service";
import { urlToPK } from "@/utils/urlToPK";
import { useRouter } from "next/router";

export default function TourCopyModal({ open, onCloseModal }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const onCopy = async () => {
    try {
      const postData = {
        name: name,
        region: data.region,
        buildings: [],
      };
      const response = await TourService.post(postData);
      onCloseModal();
      await router.push(
        `/beheer/data_toevoegen/rondes/${urlToPK(response.url)}`
      );
      setError("");
    } catch (e) {
      console.log(e);
      setError(JSON.stringify(e.response.data));
    }
  };

  useEffect(() => {
    setLoading(true);

    // fetch all the data needed for the page
    async function fetchData() {
      if (router.query.id) {
        const data = await TourService.getById(router.query.id);
        setData(data);
        setName(data.name + "_copy");
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
        <InputForm
          id={"name"}
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          label={"Nieuwe naam ronde"}
        />
      )}
    </BasicCopyModal>
  );
}
