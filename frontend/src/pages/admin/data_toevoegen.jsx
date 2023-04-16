import { useRouter } from "next/router";

export default function AdminDataAddPage() {
  const router = useRouter();
  router.push("/admin/data_toevoegen/planning");
}
