document.addEventListener('DOMContentLoaded', (event) => {
    const body = document.querySelector("body")
    // const section = document.querySelector(".section")
    // const welcome_container = document.querySelector("#welcome-container")
    const form_create_user = document.querySelector("#create-user")
    let container = document.querySelector("#container");
    let about_container;
    let profile_container;
    let show_container;
    let user;
    let all_destinations = []
    let destinations = []
    

    form_create_user.addEventListener("submit", (event) => {
        if (event.target.name.value === "") {
            return alert("Please enter a name!")
        }
        event.preventDefault()
        let name = event.target.name.value
        createNewUser(name)
        renderHomePage()
    })

    body.addEventListener("click", (event) => {
        // debugger
        if(event.target.className === "all_img" || event.target.className === "card__info") {
            body.innerHTML = ''
            renderNavbar()
            let id;
            if (event.target.parentElement.parentElement.dataset.id) {
                id = event.target.parentElement.parentElement.dataset.id
            } else if (event.target.parentElement.dataset.id) {
                id = event.target.parentElement.dataset.id
            }

            // debugger

            fetch(`http://localhost:3000/destinations/${id}`)
            .then(response => response.json())
            .then(showDestination)

            function showDestination(dest) {
                let str = 
                `<div class="show_img_div"><img class="show_img_img" data-id="${dest.id}"src="${dest.img_url}"></img></div>
                <div class="show_description_div">
                    <h1>${dest.location}</h1>
                    <p>${dest.description}</p>
                    <form class="select_flight">
                        Pick your date: <br>
                        <input type="date" name="name" class="date-input" min="2019-04-03" max="2019-12-31">
                        <input type="submit" name="submit" class="date-submit" value="Enter" data-action="create_flight" data-id="${dest.id}">
                    </form>
                </div>`


                show_container = document.createElement("DIV");
                show_container.id = "show_container"
                show_container.innerHTML = str
                document.body.appendChild(show_container);
                form_select_flight = document.querySelector(".select_flight");
                // destination = dest

            }  
        } else if (event.target.dataset.action === "create_flight") {
            event.preventDefault()
            container.innerHTML = ''
            let user_id = user.id
            let destination_id = event.target.dataset.id
            let date = event.target.parentElement.name.value

            if (date === "") {
                alert("You have not selected a date")
            } else {
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
                .then(function (flight_info) {
                    let dest = findDest(flight_info.destination_id)
                    dest.date = flight_info.date
                    destinations.push(dest)
                    renderProfile(destinations)
                })
            }

        } else if (event.target.innerText === "HOME") {
            renderHomePage()
        } else if (event.target.innerHTML === "PROFILE") {
            renderProfile(destinations)
        } else if (event.target.innerHTML === "ABOUT") {
            renderAboutPage()
        }
    })

    function renderAboutPage() {
        body.innerHTML = ''
        renderNavbar()

        let str = 
        `<div class="about_img">
            <img class="about_img_img" src="about_img.jpg">
            <h1>WELCOME TO ADVENTUREGAZE</h1>
        </div>
        <div class="about_info">
            <p>We are a team of adventures and wanderers. We carefully selected a curated list of our most favorite destinations in the world so you can browse the most unique places and see their descriptions. You can also save the date that you will be traveling into your profile page. Pick as many places as you want to explore. The wolrd is yours. Log your places so you can always safe your precious memories.</p>
            <p id="just_go">JUST GO!</p>
        </div>`

        about_container = document.createElement("DIV");
        about_container.id = "about_container"
        body.insertBefore(about_container, container)
        about_container.insertAdjacentHTML("beforeend", str) 


    }

    function findDest(id) { 
        let dest = all_destinations.find(function (destination) {
            return destination.id === id
        })
        return dest
    }

    function renderProfile(destinations) {
        body.innerHTML = ''
        let str =  
        `<nav id="nav-bar">
            <div class="logo">
                <h4>WELCOME ${user.name.toUpperCase()}</h4>
            </div>
            <ul class="nav-links">
                <li><a href="#" data-action="home">HOME</a></li>
                <li><a href="#" data-action="profile">PROFILE</a></li>  
                <li><a href="#" data-action="profile">ABOUT</a></li> 
            </ul>
        </nav>`
        body.insertAdjacentHTML("beforeend", str)
        container = document.createElement("DIV")
        container.id = "container"
        document.body.appendChild(container)

        let images = 
        `<div class="long_img"><img src="long_img.jpg"></div>
        <div class="profile_img"><img src="horse.png"></div>`

        profile_container = document.createElement("DIV");
        profile_container.id = "profile_container"
        // document.body.appendChild(profile_container);
        body.insertBefore(profile_container, container)
        profile_container.insertAdjacentHTML("beforeend", images) 

        destinations.forEach(renderUserDest)
    }

    function renderUserDest(dest) {
        let tiles = 
        `<div class="card" data-id=${dest.id}>
            <div><img class="all_img" data-id="${dest.id}" src="${dest.img_url}"></div>
            <div class="card__info">
                <h3 class="card__title">${dest.location}</h3>
                <span class="date">${dest.date}</span>
            </div>
        </div>`
        container.insertAdjacentHTML("beforeend", tiles)
    }

    function renderHomePage() {
        body.innerHTML = ''
        fetch("http://localhost:3000/destinations")
        .then(response => response.json())
        .then(renderDestinations)
    }

    function renderDestinations(dests) {
        renderNavbar()
        dests.forEach(renderOneDestination)
        all_destinations = [...dests]
    }
    function renderOneDestination(dest) {
        let str = 
        `<div class="card" data-id=${dest.id}>
            <div class="card_img"><img class="all_img" data-id="${dest.id}" src="${dest.img_url}"></div>
            <div class="card__info">
                <h3 class="card__title">${dest.location}</h3>
            </div>
        </div>`
        container.insertAdjacentHTML("beforeend", str)
    }

    function renderNavbar() {
        let str =  
        `<nav id="nav-bar">
            <div class="logo">
                <h4>AdventureGaze</h4>
            </div>
            <ul class="nav-links">
                <li><a href="#" data-action="home">HOME</a></li>
                <li><a href="#" data-action="profile">PROFILE</a></li>  
                <li><a href="#" data-action="profile">ABOUT</a></li>  
            </ul>
        </nav>`
        body.insertAdjacentHTML("beforeend", str)
        container = document.createElement("DIV")
        container.id = "container"
        document.body.appendChild(container)
    }

    function createNewUser(name) {
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
    }
})

