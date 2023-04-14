import CustomTable from "@/components/table/Table";

export default function Table() {
  return (
    <CustomTable
      className={"w-1/2 m-5"}
      columns={[
        {
          name: "Ronde",
          createCell: (ronde) => <div className={"font-bold"}>{ronde}</div>,
        },
        { name: "Student" },
        { name: "Adres" },
        { name: "Gebouwen" },
        { name: "Opmerkingen", cut: true },
      ]}
      data={[
        [
          "Ronde 1",
          "Renaat",
          "Kon. Fabiolaan 56, 9000 Gent",
          "Snegen",
          "Je mag zeggen wat je wilt. Het beste dat bestaat in deze wereld is en blijft toch 🍺",
        ],
        [
          "Ronde 2",
          "Dawyndt",
          "Kon. Fabiolaan 56, 9000 Gent",
          "Snegen",
          "Je mag zeggen wat je wilt. Het beste dat bestaat in deze wereld is en blijft toch 🍺",
        ],
      ]}
    />
  );
}
