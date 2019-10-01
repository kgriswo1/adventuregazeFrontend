document.addEventListener('DOMContentLoaded', (event) => {
    const container = document.querySelector("#container")

    container.addEventListener("keydown", (event) => {
        if(event.key === "Enter") {
            container.innerHTML = ''
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
                <img src="${dest.img_url}">
                <p>${dest.description}</p>
                </div>`
                container.insertAdjacentHTML("beforeend", str)
            }

            // fetch("http://localhost:3000/users/${}")
        }
    })


})


