document.addEventListener('DOMContentLoaded', (event) => {
    const section = document.querySelector(".section")
    const welcome_container = document.querySelector("#welcome-container")
    const container = document.querySelector("#container")
    const form_create_user = document.querySelector("#create-user")
    let user;
    let destination;
    let show_container;

    form_create_user.addEventListener("submit", (event) => {
        event.preventDefault()
        let name = event.target.name.value
    
        fetch("http://localhost:3000/users", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
                Accepts: "application/json"
            },
            body: JSON.stringify({name: name})
        })
        .then(response => response.json())
        .then(function (data) {
            user = data
        })
    
        section.innerHTML = ''
        fetch("http://localhost:3000/destinations")
        .then(response => response.json())
        .then(renderDestinations)
    
        function renderDestinations(dests) {
            dests.forEach(renderOneDestination)
        }

        function renderOneDestination(dest) {
            let str = 
            `<div class="tile" data-id=${dest.id}
            <h1>${dest.location}</h1>
            <img data-id="${dest.id}"src="${dest.img_url}">
            </div>`
            container.insertAdjacentHTML("beforeend", str)
        }
    })

    container.addEventListener("click", (event) => {
        if(event.target.tagName === "IMG") {
            container.innerHTML = ''
            fetch(`http://localhost:3000/destinations/${event.target.parentElement.dataset.id}`)
            .then(response => response.json())
            .then(showDestination)

            function showDestination(dest) {
                let str = 
                `<div class="show" data-id=${dest.id}>
                <h3>${dest.location}</h3>
                <img data-id="${dest.id}"src="${dest.img_url}"></img>
                <p>${dest.description}</p>
                <form class="select_flight">
                    <input type="date" name="name" min="2019-04-03" max="2019-12-31">
                    <input type="submit" name="submit" value="Enter" data-action="create_flight" data-id="${dest.id}">
                </form>
                </div>`
                show_container = document.createElement("DIV");
                show_container.innerHTML = str
                document.body.appendChild(show_container);
                form_select_flight = document.querySelector(".select_flight");
                destination = dest
            }  
        } else if (event.target.dataset.action === "create_flight") {
            event.preventDefault()
            container.innerHTML = ''
            let user_id = user.id
            let destination_id = event.target.dataset.id
            let date = event.target.parentElement.name.value

            fetch(`http://localhost:3000/flights`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accepts: "application/json"
                },
                body: JSON.stringify({
                    user_id: user_id,
                    destination_id: destination_id,
                    date: date
                })
            })
            .then(response => response.json())
            .then(renderProfile)

            function renderProfile(flight) {
                let str =
                `<div class="user_destination" data-id=${destination.id}>
                <h3>${destination.location}</h3>
                <img data-id="${destination.id}" src="${destination.img_url}"></img>
                <h4>Flight Date: ${flight.date}</h4>
                </div>`
                container.insertAdjacentHTML("beforeend", str)
            }
        }
    })

})
