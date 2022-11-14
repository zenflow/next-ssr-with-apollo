import type { IncomingHttpHeaders } from "http";
import React, { useEffect, useMemo } from "react";
import NextApp, {
  AppContext,
  AppInitialProps,
  AppProps,
  AppType,
} from "next/app";
import {
  ApolloClient,
  ApolloProvider,
  NormalizedCacheObject,
} from "@apollo/client";
import { getMarkupFromTree } from "@apollo/client/react/ssr";
import reactSsrPrepass from "react-ssr-prepass";
import { MockRouterContext } from "./internal/MockRouterContext";
import { CreateWithApolloOptions } from "./CreateWithApolloOptions";

type ApolloAppProps<TCache> = {
  apolloClient?: ApolloClient<TCache>;
  apolloCache?: TCache;
};

export function createWithApollo<TCache = NormalizedCacheObject>(
  options: CreateWithApolloOptions<TCache>
) {
  function createClient(headers: IncomingHttpHeaders | undefined) {
    const client = options.client({ headers });
    client.disableNetworkFetches = true; // substitute for ssrMode which can be enabled/disabled on-the-fly
    return client;
  }

  function useClient(props: ApolloAppProps<TCache>): ApolloClient<TCache> {
    const { apolloClient, apolloCache } = props;
    const client = useMemo(() => {
      if (apolloClient) return apolloClient;
      const client = createClient(undefined);
      if (apolloCache) {
        client.cache.restore(apolloCache);
      } else {
        console.warn(
          "Neither apolloClient nor apolloCache was passed as App props"
        );
      }
      return client;
    }, [apolloClient, apolloCache]);
    useEffect(() => {
      client.disableNetworkFetches = false;
      return () => client.stop();
    }, [client]);
    return client;
  }

  function withApollo(App: AppType): AppType {
    const AppWithApollo = ({
      apolloClient,
      apolloCache,
      ...props
    }: AppProps & ApolloAppProps<TCache>) => {
      const client = useClient({ apolloClient, apolloCache });
      return (
        <ApolloProvider client={client}>
          <App {...props} />
        </ApolloProvider>
      );
    };

    AppWithApollo.getInitialProps = async (
      ctx: AppContext
    ): Promise<AppInitialProps & ApolloAppProps<TCache>> => {
      const apolloClient = createClient(ctx.ctx.req?.headers);

      const getInitialProps = App.getInitialProps || NextApp.getInitialProps;
      const props = (await getInitialProps(ctx)) as AppInitialProps;
      if (ctx.ctx.res?.headersSent) {
        return props;
      }

      try {
        // Avoid using ctx.AppTree until it works client-side https://github.com/vercel/next.js/pull/23721
        await getMarkupFromTree({
          renderFunction: async (tree) => reactSsrPrepass(tree).then(() => ""),
          tree: (
            <MockRouterContext ctx={ctx}>
              <AppWithApollo
                Component={ctx.Component}
                router={ctx.router}
                {...props}
                apolloClient={apolloClient}
              />
            </MockRouterContext>
          ),
        });
      } catch (error) {
        console.error("Error from getDataFromTree", error);
      }

      (apolloClient as any).toJSON = () => undefined; // prevent apolloClient from being serialized & sent to client
      const apolloCache = ctx.ctx.req && apolloClient.cache.extract(); // serialize apolloClient cache to be sent to client
      return { ...props, apolloClient, apolloCache };
    };

    return AppWithApollo;
  }

  return withApollo;
}
