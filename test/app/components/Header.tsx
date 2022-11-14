import React, { useEffect, useState } from "react";
import { Router, useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";

export const Header: React.FC = () => {
  return (
    <header>
      <Title />
      <Nav />
      <MaybeIsAwesome />
      <WhereRendered />
      <Loader />
    </header>
  );
};

const Title: React.FC = () => {
  const router = useRouter();
  return (
    <Head>
      <title>{`test app - ${router.asPath}`}</title>
    </Head>
  );
};

const QUERY_NAV = gql`
  query {
    characters {
      id
      name
    }
  }
`;

const Nav: React.FC = () => {
  const router = useRouter();
  const { loading, error, data } = useQuery(QUERY_NAV);
  const renderLink = (path: string, label: string) => (
    <Link
      key={path}
      href={path}
      className={path === router.asPath ? "active" : ""}
    >
      {label}
    </Link>
  );
  const content = loading ? (
    "Loading..."
  ) : error ? (
    String(error)
  ) : (
    <>
      {renderLink("/", "Home")}
      {data.characters.map((character: any) =>
        renderLink(`/characters/${character.id}`, character.name)
      )}
      {renderLink("/no-ssr-query", "no-ssr-query")}
    </>
  );
  return <nav>{content}</nav>;
};

const QUERY_IS_AWESOME = gql`
  query ($id: Int!) {
    character(id: $id) {
      id
      isAwesome
    }
  }
`;

const MaybeIsAwesome: React.FC = () => {
  const router = useRouter();
  const skip = !router.asPath.startsWith("/characters/");
  const { loading, error, data } = useQuery(QUERY_IS_AWESOME, {
    skip,
    variables: { id: Number(router.query.id) },
  });
  if (skip) return <></>;
  const content = loading
    ? "Loading..."
    : error
    ? String(error)
    : data.character.isAwesome
    ? "is awesome"
    : "is not awesome";
  return <div className="is-awesome">{content}</div>;
};

const WhereRendered: React.FC = () => {
  // `isClient` is initially `false` on client (to avoid React hydration warning),
  //   but we synchronously correct it to `true` with useLayoutEffect.
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return (
    <div className="where-rendered">
      {isClient ? "client rendered" : "server rendered"}
    </div>
  );
};

const Loader: React.FC = () => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    Router.events.on("routeChangeStart", (url) => setLoading(true));
    Router.events.on("routeChangeComplete", () => setLoading(false));
    Router.events.on("routeChangeError", () => setLoading(false));
  }, []);
  return (
    <div className={`loader ${loading ? "is-loading" : "is-not-loading"}`} />
  );
};
