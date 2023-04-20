import { useRouter } from "next/router";
import AdminDashboardPage from "@/pages/admin/planning";
import Layout from "@/components/Layout";

export default function AdminDataAddPage() {
  const router = useRouter();
  router.push("/admin/data_toevoegen/planning");
}

AdminDataAddPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};