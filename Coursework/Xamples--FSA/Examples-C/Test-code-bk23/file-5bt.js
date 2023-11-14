const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

const cohortName = 'YOUR COHORT NAME HERE';
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

const fetchAllPlayers = async () => {
    try {
        const response = await fetch(APIURL);
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}${playerId}`);
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(APIURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerObj),
        });
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}${playerId}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

const renderAllPlayers = (playerList) => {
    try {
        let playerContainerHTML = '';

        playerList.forEach((player) => {
            playerContainerHTML += `
                <div class="player-card">
                    <h2>${player.name}</h2>
                    <button class="player-detail-btn">See details</button>
                    <button class="player-remove-btn">Remove from roster</button>
                </div>
            `;
        });

        playerContainer.innerHTML = playerContainerHTML;

        const playerDetailBtns = document.querySelectorAll('.player-detail-btn');
        const playerRemoveBtns = document.querySelectorAll('.player-remove-btn');

        playerDetailBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                fetchSinglePlayer(playerList[index].id);
            });
        });

        playerRemoveBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                removePlayer(playerList[index].id);
                renderAllPlayers(await fetchAllPlayers());
            });
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};

const renderNewPlayerForm = () => {
    try {
        newPlayerFormContainer.innerHTML = `
            <form id="new-player-form">
                <input type="text" id="new-player-name" placeholder="Player name" required>
                <input type="text" id="new-player-color" placeholder="Player color" required>
                <button type="submit">Add new player</button>
            </form>
        `;

        const newPlayerForm = document.getElementById('new-player-form');
        newPlayerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const playerName = document.getElementById('new-player-name').value;
            const playerColor = document.getElementById('new-player-color').value;
            const newPlayer = { name: playerName, color: playerColor };
            await addNewPlayer(newPlayer);
            renderAllPlayers(await fetchAllPlayers());
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering new player form!', err);
    }
};

fetchAllPlayers().then((data) => renderAllPlayers(data));
renderNewPlayerForm();