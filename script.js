const party_name_input = document.getElementById("party_name_input");
const party_votes_input = document.getElementById("party_votes_input");
const add_party_button = document.getElementById("add_party_button");

const parties_list = document.getElementById("parties_list");

let parties = {};
let total_votes = 0;

function generateList() {
    parties_list.innerHTML = "";
    for (const party in parties) {
        let perc = parties[party] / total_votes;

        const party_element = document.createElement("li");
        party_element.innerHTML = `<strong>${party}</strong>: `;
        party_element.innerHTML += `<span>${parties[party]}</span> `;
        party_element.innerHTML += `<span>(${(perc * 100).toFixed(2)}%)</span> `;
        party_element.innerHTML += `<progress value="${parties[party]}" max="${total_votes}"></progress>`;
        parties_list.appendChild(party_element);
    }
    const total_element = document.createElement("li");
    total_element.innerHTML = `<h3>Total: ${total_votes}</h3>`;
    parties_list.appendChild(total_element);
}

add_party_button.addEventListener("click", () => {
    const party_name = party_name_input.value;
    const party_votes = party_votes_input.value;

    // Clear the input fields
    party_name_input.value = "";
    party_votes_input.value = "";

    if (party_name === "" || party_votes === "" || party_name in parties) return;

    parties[party_name] = parseInt(party_votes);
    total_votes += parseInt(party_votes);

    generateList();
});