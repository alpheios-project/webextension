const auth0Env = {
  AUTH0_DOMAIN: 'alpheios.auth0.com',
  AUTH0_CLIENT_ID: 'PLACE_AUTH0_CLIENT_ID_HERE',
  ENDPOINTS: { 
    'wordlist' : 'https://userapis.alpheios.net/v1/words',
    'settings' : 'https://settings.alpheios.net/v1/settings'
  },
  AUDIENCE: 'alpheios.net:apis',
  SCOPE: 'openid profile',
  ALPHEIOS_DOMAIN: 'https://sfa.alpheios.net/',
  AUTH0_LOGOUT_URL: 'https://alpheios.auth0.com/v2/logout',
  AUTH0_MAX_AGE: 60
}
export default auth0Env
