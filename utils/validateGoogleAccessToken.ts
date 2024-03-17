// import { google } from 'googleapis';
import axios from 'axios';

interface GoogleTokenInfo {
  issued_to: string;
  audience: string;
  scope: string;
  expires_in: number;
  access_type: string;
}

export async function validateGoogleAccessToken(accessToken: string) {
  if (!accessToken) {
    throw new Error('Access token not provided');
  }
  try {
    // const ticket = await oAuth2Client.verifyIdToken({
    //     idToken: accessToken,
    //     audience: CLIENT_ID,
    // });
    // const tokenInfo = ticket.getPayload();
    // if (!tokenInfo) {
    //     throw new Error('Invalid token');
    // }
    const googleTokenInfo = await axios.get<GoogleTokenInfo>(
      `https://www.googleapis.com/oauth2/v1/tokeninfo`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const tokenInfo: GoogleTokenInfo = googleTokenInfo.data;
    if (!tokenInfo) {
      throw new Error('Invalid token');
    }
  } catch (error) {
    console.error('Error during token validation:', error);
    throw new Error('Error during token validation');
  }
}
