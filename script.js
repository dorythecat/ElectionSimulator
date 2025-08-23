const seats_input = document.getElementById("seats_input");
const start_election_button = document.getElementById("start_election_button");
const election_results = document.getElementById("election_results");
const export_election_results = document.getElementById("export_election_results");

const total_votes_input = document.getElementById("total_votes_input");
const party_name_input = document.getElementById("party_name_input");
const party_votes_input = document.getElementById("party_votes_input");
const party_percentage_input = document.getElementById("party_percentage_input");
const add_party_button = document.getElementById("add_party_button");

const parties_list = document.getElementById("parties_list");

let parties = {};
let total_votes = 0;

function sortObject(obj) {
    let items = Object.keys(obj).map((key) => [key, obj[key]]);
    items.sort((first, second) => second[1] - first[1]);
    return items.reduce((result, item) => {
        result[item[0]] = item[1];
        return result;
    }, {});
}

function generateList() {
    parties_list.innerHTML = "";

    parties = sortObject(parties);

    for (const party in parties) {
        let perc = parties[party] / total_votes;
        if (isNaN(perc)) perc = 0;

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
    const party_votes = parseInt(party_votes_input.value);
    const party_percentage = parseFloat(party_percentage_input.value);

    // Clear the input fields
    party_name_input.value = "";
    party_votes_input.value = "";
    party_percentage_input.value = "";

    if (isNaN(party_votes) || party_votes <= 0) {
        if (isNaN(party_percentage) || party_percentage <= 0 || party_percentage > 100) return;
        parties[party_name] = Math.round(total_votes_input.value * (party_percentage / 100));
    } else parties[party_name] = party_votes;
    total_votes += parties[party_name];

    generateList();
});

start_election_button.addEventListener("click", () => {
    let seats = parseInt(seats_input.value);
    if (isNaN(seats) || seats <= 0 || Object.keys(parties).length === 0) return;

    // D'Hondt method (https://en.wikipedia.org/wiki/D%27Hondt_method)

    // Initialize with 0 seats per party
    let seats_per_party = Object.fromEntries(Object.keys(parties).map(party => [party, 0]));

    while (seats > 0) {
        let max_party = ["", 0]; // We store the party name with its quotient
        for (const party in parties) {
            let quot = parties[party] / (seats_per_party[party] + 1);
            if (quot > max_party[1]) max_party = [party, quot];
        }
        seats_per_party[max_party[0]]++;
        seats--;
    }

    election_results.innerHTML = "";
    for (const party in seats_per_party) {
        election_results.innerHTML += `<li>${party}: ${seats_per_party[party]}</li>`;
    }
    export_election_results.style.display = "block";
    export_election_results.onclick = () => {
        const blob = new Blob([election_results.innerText], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "election_results.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
})