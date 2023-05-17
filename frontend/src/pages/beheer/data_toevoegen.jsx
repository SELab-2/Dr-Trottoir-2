import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export default function AdminDataAddPage() {
  const router = useRouter();
  router.push("/beheer/data_toevoegen/planningen");
}

AdminDataAddPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
