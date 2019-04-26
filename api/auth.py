from google.oauth2 import id_token
from google.auth.transport import requests
import logging, sys
import falcon
from typing import List

# (Receive token by HTTPS POST)
# ...
log = logging.getLogger(__name__)
log.addHandler(logging.StreamHandler(sys.stdout))
log.setLevel(logging.DEBUG)


GOOG_CLIENT_ID = "528855637927-cresrrae893u9928cpdun6hidim9jagh.apps.googleusercontent.com"

def verify_gtoken(token):
    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOG_CLIENT_ID)

        # Or, if multiple clients access the backend server:
        # idinfo = id_token.verify_oauth2_token(token, requests.Request())
        # if idinfo['aud'] not in [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]:
        #     raise ValueError('Could not verify audience.')

        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')

        # If auth request is from a G Suite domain:
        # if idinfo['hd'] != GSUITE_DOMAIN_NAME:
        #     raise ValueError('Wrong hosted domain.')

        # ID token is valid. Get the user's Google Account ID from the decoded token.
        return idinfo
    except ValueError as e:
        # Invalid token
        log.exception(e)


class AuthMiddleware:
    def __init__(self, excluded_routes: List):
        self.excluded_routes = excluded_routes

    def process_request(self, req, resp):
        uri = req.forwarded_uri
        for route in self.excluded_routes:
            if uri.endswith(route):
                return # We're excluded, so let them in.

        token = req.get_header('Authorization')

        challenges = ['Token type="Fernet"']

        if token is None:
            description = ('Please provide an auth token '
                           'as part of the request.')

            raise falcon.HTTPUnauthorized('Auth token required',
                                          description,
                                          challenges,
                                          href='http://docs.example.com/auth')

        if not self._token_is_valid(token, account_id):
            description = ('The provided auth token is not valid. '
                           'Please request a new token and try again.')

            raise falcon.HTTPUnauthorized('Authentication required',
                                          description,
                                          challenges,
                                          href='http://docs.example.com/auth')

    def _token_is_valid(self, token, account_id):
        return True  # Suuuuuure it's valid...
