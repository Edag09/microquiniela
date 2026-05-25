import GroupTable from "./GroupTable";
import GroupMatches from "./GroupMatches";
import { Card } from "primereact/card";

const GroupStage = ({ groupStandings, groupMatches }) => {
  const groups = Object.keys(groupStandings);

  return (
    <div className="grid">
      {groups.map((group) => (
        <div key={group} className="col-12 lg:col-6">
          <Card className="mb-3">
            <h2 className="text-xl font-bold mb-3">
              Grupo {group}
            </h2>
            <GroupTable standings={groupStandings[group]} />
            <div className="mt-3">
              <GroupMatches matches={groupMatches[group]} />
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default GroupStage;