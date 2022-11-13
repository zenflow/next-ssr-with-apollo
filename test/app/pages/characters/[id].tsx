import type { NextPage } from "next";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";

const QUERY_CHARACTER = gql`
  query ($id: Int!) {
    character(id: $id) {
      id
      name
      isAwesome
    }
  }
`;

const CharacterPage: NextPage = () => {
  const router = useRouter();
  const variables = { id: Number(router.query.id) };
  const { loading, error, data } = useQuery(QUERY_CHARACTER, { variables });
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{String(error)}</div>;
  return (
    <>
      <h2>{data.character.name}</h2>
      <h3>{data.character.isAwesome ? "is awesome" : "is not awesome"}</h3>
    </>
  );
};

export default CharacterPage;
