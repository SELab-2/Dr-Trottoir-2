import BasicCopyModal from "@/components/forms/forms-copy-modal/BasicCopyModal";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import InputForm from "@/components/forms/forms-components/forms-input/InputForm";
import BuildingService from "@/services/building.service";
import { urlToPK } from "@/utils/urlToPK";

export default function BuildingCopyModal({ open, onCloseModal }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const onCopy = async () => {
    try {
      const postData = {
        nickname: name,
        description: data.description,
        address_line_1: data.address_line_1,
        address_line_2: data.address_line_2,
        region: data.region,
        country: data.country,
      };
      const response = await BuildingService.post(postData);
      onCloseModal();
      await router.push(
        `/beheer/data_toevoegen/gebouwen/${urlToPK(response.url)}`
      );
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
        const data = await BuildingService.getById(router.query.id);
        setData(data);
        setName(data.nickname + "_copy");
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
          label={"Nieuwe naam gebouw"}
        />
      )}
    </BasicCopyModal>
  );
}
