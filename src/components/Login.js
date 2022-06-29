import React from "react";

const CLIENT_ID = "e2b6fd6022f84996898f9e65f2fc5d16";
const REDIRECT_URI = "http://localhost:1234/";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const Login = ({ token }) => {
  if (token == "" || !token) {
    return (
      <a
        href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
      >
        Login to Spotify
      </a>
    );
  }
};
export default Login;
