import { fetchCharacterData } from "../../api/queris";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

// 🛣️ Define the route for character detail using TanStack Router
export const Route = createFileRoute("/character/$charId")({
  component: CharacterComponent,
});

function CharacterComponent() {
  const { charId } = Route.useParams();
  const { data, isError, error, isPending } = useQuery({
    queryKey: ["characterData"],
    queryFn: () => fetchCharacterData(charId),
  });

  const formatDate = (givenDate: string): string => {
    return givenDate.split("T")[0];
  };

  if (isPending) return <div className="commonText">Loading...</div>;
  if (isError) return <div className="commonText">Error: {error.message}</div>;
  if (!data) return <div className="commonText">No data found.</div>;

  return (
    <>
      <div className="characterContainer">
        <div className="characterContainer-detail">
          <h1>
            <u> Character Detail</u>
          </h1>
          <div>
            <img src={data.image} height="250" width="300" />
          </div>
          <ul>
            <li>
              <strong>Name:- </strong> {data.name ?? "-"}
            </li>
            <li>
              <strong>Created:- </strong> {formatDate(data.created)}
            </li>
            <li>
              <strong>Gender:- </strong>{" "}
              {data.gender == "unknow" ? "-" : data.gender}
            </li>
            <li>
              <strong>Species:- </strong> {data.species ?? "-"}
            </li>
            <li>
              <strong>Status:- </strong> {data.status ?? "-"}
            </li>
            <li>
              <strong>Type:- </strong> {data.type ?? "-"}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
