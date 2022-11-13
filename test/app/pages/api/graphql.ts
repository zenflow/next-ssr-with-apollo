import { setTimeout } from "timers/promises";
import type { NextApiRequest, NextApiResponse } from "next";
import { createYoga, createSchema } from "graphql-yoga";
// import { addServerLog } from "./server-logs";

type Character = {
  id: number;
  name: string;
  isAwesome: boolean;
};

const characters: Character[] = [
  { id: 1, name: "Rick Sanchez", isAwesome: true },
  { id: 2, name: "Morty Brown", isAwesome: false },
  { id: 3, name: "Jerry Smith", isAwesome: false },
];

const numberOfSeasons = 6;

const schema = createSchema({
  typeDefs: `
    type Query {
      characters: [Character!]!
      character(id: Int!): Character
      numberOfSeasons: Int!
    }
    type Character {
      id: Int!
      name: String!
      isAwesome: Boolean!
    }
  `,
  resolvers: {
    Query: {
      characters: () => characters,
      character: (_, { id }) => characters.find((c) => c.id === id),
      numberOfSeasons: () => numberOfSeasons,
    },
  },
});

const yoga = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
});

const serve = async (req: NextApiRequest, res: NextApiResponse) => {
  // checking logs in tests won't work since multiple queries are fired at same time, and will be logged in random order
  // addServerLog(req, res);
  await setTimeout(250);
  await yoga(req, res);
};

export default serve;
