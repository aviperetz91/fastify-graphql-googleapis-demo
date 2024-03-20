import 'graphql-import-node';
import fastify from 'fastify';
import session from '@fastify/session';
import cookie from '@fastify/cookie';
import { google } from 'googleapis';
import mercurius from 'mercurius';
import { makeExecutableSchema } from '@graphql-tools/schema';

// @ts-ignore
import contactSchema from './graphql/schemas/contact.schema.graphql';
import eventSchema from './graphql/schemas/event.schema.graphql';

import contactResolvers from './graphql/resolvers/contact.resolvers';
import eventResolvers from './graphql/resolvers/event.resolvers';

import { validateGoogleAccessToken } from './utils/validateGoogleAccessToken';
import {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  SCOPE,
  SESSION_SECRET,
} from './configuration/constants';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const mergedSchema = makeExecutableSchema({
  typeDefs: [contactSchema, eventSchema],
  resolvers: [contactResolvers, eventResolvers],
});

async function main() {
  const server = fastify({ logger: true });

  server.register(cookie);

  server.register(session, {
    secret: `${SESSION_SECRET}`,
    cookie: { secure: false },
  });

  server.get('/', async (request, reply) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPE,
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
      (request.session as any).accessToken = accessToken;
      reply.redirect(`/graphiql`);
    } catch (error) {
      console.error('Error during authentication:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  server.register(mercurius, {
    path: '/graphql',
    schema: mergedSchema,
    graphiql: true,
    context: async (request, reply) => {
      const accessToken =
        (request.query as any).accessToken || (request.session as any).accessToken;
      await validateGoogleAccessToken(accessToken);
      return { accessToken };
    },
  });

  try {
    await server.listen({ port: 3000 });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

main();
