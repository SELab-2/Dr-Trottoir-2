import Layout from "@/components/Layout";

export default function AdminDataAddPage() {
  return <></>;
}

AdminDataAddPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/beheer/data_toevoegen/planningen",
      permanent: false,
    },
  };
}
