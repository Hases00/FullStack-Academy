const cohortName = "2308-ACC-PT-WEB-PT-A";
const apiURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

const renderPlayer = (player) => {
    const playerElement = document.createElement('div');
    playerElement.textContent = `${player.firstName} ${player.lastName}`;
    return playerElement;
};

const fetchPlayers = async () => {
    try {
        const response = await fetch(apiURL);
        const players = await response.json();
        return players;
    } catch (error) {
        console.error("Error fetching players:", error);
    }
};

const renderAllPlayers = async () => {
    const players = await fetchPlayers();
    const playerElements = players.map(renderPlayer);
    const allPlayersContainer = document.getElementById('all-players');
    playerElements.forEach(playerElement => allPlayersContainer.appendChild(playerElement));
};

renderAllPlayers();