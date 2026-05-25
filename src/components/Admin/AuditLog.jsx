import { useState, useEffect } from "react";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import { db } from "../../firebase/config";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";

const ACTION_SEVERITY = {
  USER_LOGIN:             "info",
  PREDICTION_SAVED:       "success",
  PREDICTION_EDITED:      "warning",
  RESULT_SET:             "success",
  RESULT_EDITED:          "warning",
  POINTS_RECALCULATED:    "info",
};

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "auditLog"),
      orderBy("timestamp", "desc"),
      limit(200)
    );

    const unsub = onSnapshot(q, (snap) => {
      setLogs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const actionOptions = [
    { label: "Todas", value: null },
    { label: "Login", value: "USER_LOGIN" },
    { label: "Predicción guardada", value: "PREDICTION_SAVED" },
    { label: "Predicción editada", value: "PREDICTION_EDITED" },
    { label: "Resultado ingresado", value: "RESULT_SET" },
    { label: "Resultado editado", value: "RESULT_EDITED" },
  ];

  const filteredLogs = filterAction
    ? logs.filter((l) => l.action === filterAction)
    : logs;

  const actionTemplate = (rowData) => (
    <Tag
      value={rowData.action}
      severity={ACTION_SEVERITY[rowData.action] ?? "info"}
    />
  );

  const timestampTemplate = (rowData) => {
    if (!rowData.timestamp) return "-";
    const date = rowData.timestamp.toDate?.();
    if (!date) return "-";
    return date.toLocaleString("es-GT");
  };

  const adminTemplate = (rowData) => (
    rowData.isAdmin
      ? <Tag value="Admin" severity="warning" icon="pi pi-star" />
      : <span className="text-color-secondary">—</span>
  );

  if (loading) return <ProgressSpinner />;

  return (
    <div>
      <div className="mb-3 flex align-items-center gap-2">
        <label className="font-semibold">Filtrar por acción:</label>
        <Dropdown
          value={filterAction}
          options={actionOptions}
          onChange={(e) => setFilterAction(e.value)}
          placeholder="Todas"
        />
        <span className="text-color-secondary text-sm ml-auto">
          {filteredLogs.length} registros
        </span>
      </div>

      <DataTable
        value={filteredLogs}
        stripedRows
        showGridlines
        responsiveLayout="scroll"
        size="small"
        paginator
        rows={20}
      >
        <Column header="Fecha" body={timestampTemplate} style={{ width: "160px" }} />
        <Column header="Usuario" field="userName" style={{ width: "120px" }} />
        <Column header="Acción" body={actionTemplate} style={{ width: "160px" }} />
        <Column header="Detalle" field="detail" />
        <Column header="Admin" body={adminTemplate} style={{ width: "80px" }} />
      </DataTable>
    </div>
  );
};

export default AuditLog;