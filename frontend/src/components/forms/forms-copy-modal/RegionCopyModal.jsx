import BasicCopyModal from "@/components/forms/forms-copy-modal/BasicCopyModal";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import RegionService from "@/services/region.service";
import InputForm from "@/components/forms/forms-components/forms-input/InputForm";
import Loading from "@/components/Loading";
import { urlToPK } from "@/utils/urlToPK";

export default function RegionCopyModal({ open, onCloseModal }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const onCopy = async () => {
    try {
      const postData = {
        region_name: name,
      };
      const response = await RegionService.post(postData);
      onCloseModal();
      await router.push(
        `/beheer/data_toevoegen/regio/${urlToPK(response.url)}`
      );
      router.reload();
    } catch (e) {
      setError(JSON.stringify(e.response.data));
    }
  };

  useEffect(() => {
    setLoading(true);

    // fetch all the data needed for the page
    async function fetchData() {
      if (router.query.id) {
        const data = await RegionService.getById(router.query.id);
        setName(data.region_name + "_copy");
      }
    }

    fetchData().then(() => setLoading(false));
  }, [router.query.id]);

  return (
    <BasicCopyModal
      onCancel={onCloseModal}
      onCopy={onCopy}
      open={open}
      loading={loading}
      error={error}
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
          label={"Nieuwe naam regio"}
        />
      )}
    </BasicCopyModal>
  );
}
