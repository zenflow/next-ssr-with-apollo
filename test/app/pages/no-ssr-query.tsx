import { NextPage } from "next";
import { gql, useQuery } from "@apollo/client";

const NUMBER_OF_SEASONS_QUERY = gql`
  query {
    numberOfSeasons
  }
`;

const NoSsrQueryPage: NextPage = () => {
  const { loading, error, data } = useQuery(NUMBER_OF_SEASONS_QUERY, {
    ssr: false,
  });
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{String(error)}</div>;
  return <h2>{`${data.numberOfSeasons} seasons`}</h2>;
};

export default NoSsrQueryPage;
