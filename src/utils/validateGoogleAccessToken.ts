import axios from 'axios';

export async function validateGoogleAccessToken(accessToken: String) {
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
        //     throw new Error('Invalid token payload');
        // }
        const tokenInfoResponse = await axios.get(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
        const tokenInfo = tokenInfoResponse.data;
        if (!tokenInfo || tokenInfo.error) {
            throw new Error('Invalid token');
        }
    } catch (error: any) {
        console.error('Error during token validation:', error);
        throw new Error('Error during token validation');
    }
}