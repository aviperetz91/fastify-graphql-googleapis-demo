import fastify from 'fastify';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import axios from 'axios';

dotenv.config();
console.log(process.env);

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
    console.log("=== Authorization URL: ", authUrl);
    return reply.redirect(authUrl);
});

server.get('/auth/callback', async (request, reply) => {
    const authCode: string = (request.query as any).code;
    if (!authCode) {
        return reply.status(400).send({ error: 'Authorization code not provided' });
    }
    console.log("=== Authorization Code: ", authCode);
    try {
        const { tokens } = await oAuth2Client.getToken(authCode);
        const accessToken = tokens.access_token;
        console.log("=== Access Token: ", accessToken);
        reply.redirect(`/validateToken?accessToken=${accessToken}`)
    } catch (error: any) {
        console.error('Error during authentication:', error);
        reply.status(500).send({ error: 'Internal Server Error' });
    }
});

server.get('/validateToken', async (request, reply) => {
    const accessToken = (request.query as any).accessToken;
    if (!accessToken) {
        return reply.status(400).send({ error: 'Access token not provided' });
    }
    try {
        // const ticket = await oAuth2Client.verifyIdToken({
        //     idToken: accessToken,
        //     audience: CLIENT_ID,
        // });
        // const tokenInfo = ticket.getPayload();
        // if (!tokenInfo) {
        //     throw new Error('Invalid token payload');
        // }
        const tokenInfoResponse = await axios.get(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
        const tokenInfo = tokenInfoResponse.data;
        console.log("=== Token Info", tokenInfo);
    } catch (error) {
        console.error('Error during token validation:', error);
        reply.status(500).send({ error: 'Internal Server Error' });
    }
});

const start = async () => {
    try {
        await server.listen({ port: PORT });
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
