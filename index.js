document.addEventListener('DOMContentLoaded', (event) => {
    const body = document.querySelector("body")
    const section = document.querySelector(".section")
    const welcome_container = document.querySelector("#welcome-container")
    const form_create_user = document.querySelector("#create-user")
    let container = document.querySelector("#container");
    let user;
    let destination;

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
    
        body.innerHTML = ''
        fetch("http://localhost:3000/destinations")
        .then(response => response.json())
        .then(renderDestinations)
    
        function renderDestinations(dests) {
            let str =  
            `<nav id="nav-bar">
                <div class="logo">
                    <h4>AdventureGaze</h4>
                </div>
                <ul class="nav-links">
                    <li>
                        <a href="#" data-action="home">Home</a>
                    </li>
                    <li>
                        <a href="#" data-action="profile">Profile</a>
                    </li>    
                </ul>
            </nav>`
            body.insertAdjacentHTML("beforeend", str)
            container = document.createElement("DIV")
            container.id = "container"
            document.body.appendChild(container)
            dests.forEach(renderOneDestination)
        }
        // <div class="img img1"><img data-id="${dest.id}" src="${dest.img_url}"></div>
        // <svg class="card__like"  viewBox="0 0 24 24">

        function renderOneDestination(dest) {
            let str = 
            `<div class="card" data-id=${dest.id}>
                <div><img data-id="${dest.id}" src="${dest.img_url}"></div>
                <div class="card__info">
                    <h3 class="card__title">${dest.location}</h3>
                </div>
            </div>`
            container.insertAdjacentHTML("beforeend", str)
        }
    })

    body.addEventListener("click", (event) => {
        // debugger
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
                container.insertAdjacentHTML("beforeend", str)
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

