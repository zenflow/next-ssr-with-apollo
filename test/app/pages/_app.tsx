import "./global.css";
import assert from "assert";
import App from "next/app";
import type { AppContext, AppProps } from "next/app";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createWithApollo } from "../../..";
import { Header } from "../components/Header";

const withApollo = createWithApollo({
  client({ headers }) {
    const isServer = typeof window === "undefined";
    if (isServer) {
      assert.ok(headers!.host, "`headers` should be available server-side");
    } else {
      assert.ok(!headers, "`headers` should not be available client-side");
    }
    const baseUrl = isServer ? "http://127.0.0.1:3000" : "";
    return new ApolloClient({
      uri: `${baseUrl}/api/graphql`,
      cache: new InMemoryCache(),
    });
  },
});

function MyApp(props: AppProps) {
  const { Component, pageProps } = props;
  // @ts-ignore can't properly type this function, see https://github.com/vercel/next.js/issues/42846
  const { extraAppProp } = props;
  return (
    <>
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
      <p>{`extraAppProp: ${extraAppProp}`}</p>
    </>
  );
}

MyApp.getInitialProps = async (ctx: AppContext) => {
  const props = await App.getInitialProps(ctx);
  return {
    ...props,
    extraAppProp: true,
  };
};

export default withApollo(MyApp);
