const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");

const cohortName = "2308-ACC-PT-WEB-PT-A";
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

const state = {
 players: [],
};

const fetchAllPlayers = async () => {
 try {
    const response = await fetch(APIURL);
    const json = await response.json();
    const AllPlayers = json.data;
    console.log("inside GET");
    console.log(AllPlayers);
    if (json.error) {
      throw new Error(json.error);
    }
    state.players = AllPlayers;
 } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
 }
};

const fetchSinglePlayer = async (playerId) => {
 try {
    const response = await fetch(`${APIURL}/${playerId}`);
    const json = await response.json();
    const playerId = json.data;
    console.log("inside GET");
    console.log(playerId);
    if (json.error) {
      throw new Error(json.error);
    }
 } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
 }
};

const addNewPlayer = async (playerObj) => {
 try {
    const response = await fetch(APIURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerObj),
    });
    const json = await response.json();
    console.log("inside POST");
    console.log(json);
    if (json.error) {
      throw new Error(json.error);
    }
 } catch (err) {
    console.error("Oops, something went wrong with adding the player!", err);
 }
};

const removePlayer = async (playerId) => {
 try {
    const response = await fetch(`${APIURL}/${playerId}`, {
      method: "DELETE",
    });
    const json = await response.json();
    console.log("inside DELETE");
    console.log(json);
    if (json.error) {
      throw new Error(json.error);
    }
 } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
 }
};

const renderAllPlayers = () => {
 try {
    let playerContainerHTML = "";
    state.players.forEach((player) => {
      playerContainerHTML += `
      <div class="player-card">
        <h2>${player.name}</h2>
        <button class="btn-view-details" data-id="${player.id}">See details</button>
        <button class="btn-remove-player" data-id="${player.id}">Remove from roster</button>
      </div>
      `;
    });
    playerContainer.innerHTML = playerContainerHTML;
    Array.from(document.getElementsByClassName("btn-view-details")).forEach(
      (button) => {
        button.addEventListener("click", (e) => {
          const playerId = e.target.dataset.id;
          fetchSinglePlayer(playerId);
        });
      }
    );
    Array.from(document.getElementsByClassName("btn-remove-player")).forEach(
      (button) => {
        button.addEventListener("click", (e) => {
          const playerId = e.target.dataset.id;
          removePlayer(playerId);
        });
      }
    );
 } catch (err) {
    console.error("Uh oh, trouble rendering players!", err);
 }
};

const renderNewPlayerForm = () => {
 try {
    newPlayerFormContainer.innerHTML = `
      <form id="new-player-form">
        <input type="text" id="name" placeholder="Name" required />
        <input type="number" id="score" placeholder="Score" required />
        <input type="text" id="avatar" placeholder="Avatar URL" required />
        <button type="submit">Add new player</button>
      </form>
    `;
    document
      .getElementById("new-player-form")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const score = document.getElementById("score").value;
        const avatar = document.getElementById("avatar").value;
        const newPlayer = { name, score, avatar };
        addNewPlayer(newPlayer);
      });
 } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
 }
};

document.addEventListener("DOMContentLoaded", () => {
 fetchAllPlayers();
 renderAllPlayers();
 renderNewPlayerForm();
});


</s><s>// The following line makes sure your styles are included in the project. Don't remove this.
import '../styles/main.scss';
// Import any additional modules you want to include below \/
import "phoenix_html";


// \/ All of your javascript goes here \/


console.log("Hello world from main.js");

// https://github.com/nfriend/vue-apollo-demo



// Apollo Boost documentation: https://www.apollographql.com/docs/react/api/apollo-boost/


// If you need to use apollo-link-context for authentication:
// import { setContext } from 'apollo-link-context';

// // Define your graphql endpoint
// const uri = 'http://localhost:4000/graphql';

// // Configure your Apollo client with uri & cache
// const client = new ApolloClient({
//   uri,
//   cache: new InMemoryCache(),
//   // Add context if you need authentication
//   link: setContext((_, { headers }) => {
//     const token = localStorage.getItem('YOUR_AUTH_TOKEN_KEY');
//     return {
//       headers: {
//         ...headers,
//         authorization: token ? `Bearer ${token}` : "",
//       },
//     };
//   }),
// });

// const App = () => (
//   <ApolloProvider client={client}>
//     <div className="App">
//       <h1>Vue Apollo Boost Demo</h1>
//       <AddBook />
//       <BookList />
//     </div>
//   </ApolloProvider>
// );

// render(<App />, document.getElementById('app'));

// export default App;

// Make sure you replace YOUR_AUTH_TOKEN_KEY with your actual authentication token key..</s>