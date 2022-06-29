import React, { useEffect, useState } from "react";
import Artist from "./Artist";
import Search from "./Search";
import Login from "./Login";

const BASE_SPOTIFY_ADDRESS = "https://api.spotify.com/v1";

class App extends React.Component {
  state = { token: "", searchKey: "", artist: "", tracks: [] };

  componentDidMount() {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    this.setState({ token });
  }

  logout = () => {
    this.setState({ token: "" });
    window.localStorage.removeItem("token");
  };

  searchArtist = artistQuery => {
    const requestOptions = {
      method: "GET",
      headers: { Authorization: `Bearer ${this.state.token}` },
    };
    fetch(
      `${BASE_SPOTIFY_ADDRESS}/search?q=${artistQuery}&type=artist&limit=1`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.artists.total > 0) {
          const artist = data.artists.items[0];
          this.setState({ artist });
          fetch(
            `${BASE_SPOTIFY_ADDRESS}/artists/${this.state.artist.id}/top-tracks?country=US`,
            requestOptions
          )
            .then((response) => response.json())
            .then((json) => this.setState({ tracks: json.tracks }))
            .catch((err) => alert("Track : ", err.message));
        }
      })
      .catch((err) => alert(err.message));
  };

  render() {
    console.log(this.state);
    return (
      <div>
        <h1>Music</h1>
        {!this.state.token ? (<Login />) : (<button onClick={this.logout}>Logout</button>)}
        {this.state.token ? (<Search searchArtist={this.searchArtist} />) : (<h2>Please login</h2>)}
        <Artist artist={this.state.artist} />
      </div>
    );
  }
}

export default App;
