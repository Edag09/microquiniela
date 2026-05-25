import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const GroupTable = ({ standings }) => {
  const teamTemplate = (rowData, { rowIndex }) => (
    <div className="flex align-items-center gap-2">
      <span className="text-lg">{rowData.flag}</span>
      <span className={rowIndex < 2 ? "font-bold" : ""}>
        {rowData.team}
      </span>
      {rowIndex < 2 && (
        <span
          className="text-xs px-1 border-round"
          style={{
            background: "var(--green-800)",
            color: "var(--green-200)",
          }}
        >
          Clasifica
        </span>
      )}
    </div>
  );

  const ptsTemplate = (rowData) => (
    <span className="font-bold" style={{ color: "var(--primary-color)" }}>
      {rowData.pts}
    </span>
  );

  return (
    <DataTable
      value={standings}
      showGridlines
      size="small"
      responsiveLayout="scroll"
    >
      <Column header="Equipo" body={teamTemplate} />
      <Column field="pj" header="PJ" style={{ width: "40px", textAlign: "center" }} />
      <Column field="g" header="G" style={{ width: "40px", textAlign: "center" }} />
      <Column field="e" header="E" style={{ width: "40px", textAlign: "center" }} />
      <Column field="p" header="P" style={{ width: "40px", textAlign: "center" }} />
      <Column field="gf" header="GF" style={{ width: "40px", textAlign: "center" }} />
      <Column field="gc" header="GC" style={{ width: "40px", textAlign: "center" }} />
      <Column field="dg" header="DG" style={{ width: "40px", textAlign: "center" }} />
      <Column header="Pts" body={ptsTemplate} style={{ width: "50px", textAlign: "center" }} />
    </DataTable>
  );
};

export default GroupTable;