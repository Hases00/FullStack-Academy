const cohortName = "2308-ACC-PT-WEB-PT-A";
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

const state = {
 players: [],
};

const fetchAllPlayers = async () => {
 try {
    const response = await axios.get(APIURL);
    const allPlayers = response.data;
    console.log("inside GET");
    console.log(allPlayers);
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    state.players = allPlayers;
 } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
 }
};

const fetchSinglePlayer = async (playerId) => {
 try {
    const response = await axios.get(`${APIURL}/${playerId}`);
    const player = response.data;
    console.log("inside GET");
    console.log(player);
    if (response.data.error) {
      throw new Error(response.data.error);
    }
 } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
 }
};

const addNewPlayer = async (playerObj) => {
 try {
    const response = await axios.post(APIURL, playerObj);
    const newPlayer = response.data;
    console.log("inside POST");
    console.log(newPlayer);
    if (response.data.error) {
      throw new Error(response.data.error);
    }
 } catch (err) {
    console.error("Uh oh, trouble adding new player!", err);
 }
};

const removePlayer = async (playerId) => {
 try {
    const response = await axios.delete(`${APIURL}/${playerId}`);
    console.log("inside DELETE");
    console.log(response.data);
    if (response.data.error) {
      throw new Error(response.data.error);
    }
 } catch (err) {
    console.error(`Oh no, trouble removing player #${playerId}!`, err);
 }
};

const renderAllPlayers = async () => {
 // Render code goes here
};

const renderNewPlayerForm = () => {
 // Render code goes here
};

const init = async () => {
 await fetchAllPlayers();
 renderAllPlayers();

 renderNewPlayerForm();
};

init();