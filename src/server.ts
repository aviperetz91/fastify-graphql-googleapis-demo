import fastify from 'fastify';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import mercurius from 'mercurius';
import { makeExecutableSchema } from 'graphql-tools';
import { contactSchema } from './graphql/peopleSubgraph/contactSchema';
import { contactResolvers } from './graphql/peopleSubgraph/contactResolvers';
import { eventSchema } from './graphql/calendarSubgraph/eventSchema';
import { eventResolvers } from './graphql/calendarSubgraph/eventResolvers';
import { validateGoogleAccessToken } from './utils/validateGoogleAccessToken';

dotenv.config();

const PORT = 3000;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const scopes = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/contacts.readonly',
];

const server = fastify({ logger: true });

server.get('/', async (request, reply) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  return reply.redirect(authUrl);
});

server.get('/auth/callback', async (request, reply) => {
  const authCode = (request.query as any).code;
  if (!authCode) {
    reply.status(400).send({ error: 'Authorization code not provided' });
  }
  try {
    const { tokens } = await oAuth2Client.getToken(authCode);
    oAuth2Client.setCredentials(tokens);
    const accessToken = tokens.access_token;
    reply.redirect(`/graphql?accessToken=${accessToken}`);
  } catch (error) {
    console.error('Error during authentication:', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
});

const mergedSchema = makeExecutableSchema({
  typeDefs: [contactSchema, eventSchema],
});

const mergedResolvers = {
  Query: {
    ...contactResolvers.Query,
    ...eventResolvers.Query,
  },
};

server.register(mercurius, {
  schema: mergedSchema,
  resolvers: mergedResolvers,
  path: '/graphql',
  graphiql: true,
  context: async (request, reply) => {
    const accessToken = (request.query as any).accessToken;
    await validateGoogleAccessToken(accessToken);
    return { accessToken };
  },
});

const start = async () => {
  try {
    await server.listen({ port: PORT });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

start();
