import Layout from "@/components/Layout";
import MobileLayout from "@/components/MobileLayout";

export default function StudentPlanningPage() {
  // TODO: Implement this page
  return (
    <>
      <div>
        <p>placeholder</p>
      </div>
    </>
  );
}

StudentPlanningPage.getLayout = function getLayout(page) {
  return <MobileLayout>{page}</MobileLayout>;
};
