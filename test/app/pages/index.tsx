import type { NextPage } from "next";
import { useQuery, gql } from "@apollo/client";

const QUERY_CHARACTERS = gql`
  query {
    characters {
      id
      name
      isAwesome
    }
  }
`;

type IndexPageProps = {
  extraPageProp: boolean;
};

const IndexPage: NextPage<IndexPageProps> = ({ extraPageProp }) => {
  const { loading, error, data } = useQuery(QUERY_CHARACTERS);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{String(error)}</div>;
  return (
    <>
      <ul>
        {data.characters.map((character: any) => (
          <li key={character.id}>
            <strong>{`(${character.id})`}</strong>{" "}
            <span>
              {`${character.name} (${
                character.isAwesome ? "is awesome" : "is not awesome"
              })`}
            </span>
          </li>
        ))}
      </ul>
      <p>{`extraPageProp: ${extraPageProp}`}</p>
    </>
  );
};

IndexPage.getInitialProps = (ctx) => {
  return {
    extraPageProp: true,
  };
};

export default IndexPage;
