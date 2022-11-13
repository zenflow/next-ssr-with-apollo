# next-ssr-with-apollo
Opinionated HOC to integrate Apollo into an SSR Next.js app

[![npm version](https://img.shields.io/npm/v/next-ssr-with-apollo)](http://npmjs.com/package/next-ssr-with-apollo)
[![Known Vulnerabilities](https://snyk.io/test/github/zenflow/next-ssr-with-apollo/badge.svg?targetFile=package.json)](https://snyk.io/test/github/zenflow/next-ssr-with-apollo?targetFile=package.json)
[![GitHub issues welcome](https://img.shields.io/badge/issues-welcome-brightgreen.svg?logo=GitHub)](https://github.com/zenflow/next-ssr-with-apollo/issues)
[![GitHub pull requests welcome](https://img.shields.io/badge/pull%20requests-welcome-brightgreen.svg?logo=GitHub)](https://github.com/zenflow/next-ssr-with-apollo/pulls)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)

## Features

- Allow child components to declare their own data dependencies.
*(None of the prop-drilling from getServerSideProps examples.)*
- Support data dependencies in any component, including components used in App layout.
*(Note this uses App getInitialProps and opts-out of any pages in the app being static.)*
- Prefetch data before displaying new route on client-side navigation, same as server-side navigation.
*(Avoid displaying next page in a loading state.)*
- Simplified caching model: Start fresh when navigating to new route.
*(Don't worry about so much about `fetchPolicy`, `nextFetchPolicy`, manually refetching queries,
or the [unpredictabile side-effects of these features](https://github.com/apollographql/apollo-client/issues/7938).*

## Installation

Inside your Next.js project:

```
npm install @apollo/client next-ssr-with-apollo
```

## Usage

Wrap your App component to provide apollo client for your entire app.

pages/App.tsx

```tsx
import type { AppProps } from "next/app";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createWithApollo } from "next-ssr-with-apollo";

const withApollo = createWithApollo({
  client() {
    return new ApolloClient({
      uri: "https://rickandmortyapi.graphcdn.app/",
      cache: new InMemoryCache(),
    });
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default withApollo(MyApp);
```

Now you can use [apollo hooks](https://www.apollographql.com/docs/react/api/react/hooks/#usequery)
in any component in your app, and queries will be prefetched before a route is shown.

Queries with the `ssr: false` option won't be prefetched (server-side *or client-side*).
They will initially be in a loading state when the route is shown.

## Options

### `client`

The `client` factory, where you define your Apollo Client, is invoked:
- on server: once per request
- on client: once per page load *and once per client-side navigation*

The `client` factory receives some params:
- `headers` - HTTP request headers. Only defined on server side.

**Example**

```tsx
const withApollo = createWithApollo({
  client({ headers }) {
    const isServer = typeof window === "undefined";
    const baseUri = isServer ? "http://127.0.0.1:3000" : "";
    return new ApolloClient({
      uri: `${baseUri}/api/graphql`,
      headers:
        isServer && headers!.authorization
          ? { authorization: headers!.authorization }
          : {},
      cache: new InMemoryCache(),
    });
  },
});
```
