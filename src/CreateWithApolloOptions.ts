import { ApolloClient } from "@apollo/client";
import { IncomingHttpHeaders } from "http";

export interface CreateWithApolloOptions<TCache> {
  client: (params: {
    headers: IncomingHttpHeaders | undefined;
  }) => ApolloClient<TCache>;
}
