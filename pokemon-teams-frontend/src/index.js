const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`


document.addEventListener("DOMContentLoaded", function(e) {


    function getTrainers() {
        fetch(TRAINERS_URL)
        .then(resp=>resp.json())
        .then(data=>{parseTrainers(data)})

    }

    function parseTrainers(trainers) {
        for(const trainer of trainers){
            renderTrainer(trainer)
            renderTrainerPokes(trainer.pokemons)
        }
    }

    function renderTrainer(trainer){
        let cardDiv = document.createElement("div"),
            cardBtn = document.createElement("button"),
            cardP = document.createElement("p");

        cardDiv.classList.add("card"),
        cardDiv.dataset.id = trainer.id,
        cardBtn.innerText="Add Pokemon",
        cardBtn.dataset.trainerId = trainer.id;

        cardP.textContent = `${trainer.name}`;

        // consider returning renderTrainerPokes value here to avoid needing the div id?
        // let cardUl = document.createElement("ul");


        cardDiv.appendChild(cardP),
        cardDiv.appendChild(cardBtn),
        // cardDiv.appendChild(cardUl);

        document.querySelector("main").appendChild(cardDiv);
    }

    // pokes rendering and appending to the trainer card by trainer id since div has id of trainer
    function renderTrainerPokes(trainerPokes) {

        const frag = new DocumentFragment();
        const pokeUl = document.createElement("ul");
        frag.append(pokeUl);

        let trainer;

        for (const poke of trainerPokes){

            let pokeLi = document.createElement("li"),
                pokeBtn = document.createElement("button");
                
            pokeBtn.classList.add("release"),
            pokeBtn.textContent = "Release",
            pokeBtn.dataset.pokemonId = poke.id;
            
            pokeLi.innerHTML = `${poke.nickname} (${poke.species})`;
            pokeLi.appendChild(pokeBtn);
            
            pokeUl.appendChild(pokeLi);
            
            trainer = document.querySelector(`[data-id="${poke.trainer_id}"]`);
        }

        trainer.appendChild(frag);
    }

    // Update Trainer after POST for one Pokemon
    function updateRenderTrainerPokes(newPoke) {
        let trainer = document.querySelector(`[data-id="${newPoke.trainer_id}"]`),
              trainerUl = trainer.querySelector("ul");

        // rendering new Pokemon to HTML
        let pokeLi = document.createElement("li"),
                pokeBtn = document.createElement("button");
                
            pokeBtn.classList.add("release"),
            pokeBtn.textContent = "Release",
            pokeBtn.dataset.pokemonId = newPoke.id;
            
            pokeLi.innerHTML = `${newPoke.nickname} (${newPoke.species})`;
            pokeLi.appendChild(pokeBtn);
            
            trainerUl.appendChild(pokeLi);
            
            trainer = document.querySelector(`[data-id="${newPoke.trainer_id}"]`);

        console.log(trainer)
    }

    function releasePokemon(byePoke) {

        let releaseBtn = byePoke,
            releaseTargetId = releaseBtn.dataset.pokemonId;

        // Delete Request to API here
        console.log(releaseTargetId)
        deletePokemon(releaseTargetId)

        // removeParent Node here
        console.log(releaseBtn)
        let parentEle = releaseBtn.parentElement;
        parentEle.remove()
    }

    function getPokemon(trainerId) {

        const fetchOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ trainer_id: trainerId })
        }

        let pokeTest
        //? do we need return here?
        fetch(POKEMONS_URL, fetchOptions)
        .then(resp => resp.json())
        .then(newPoke => updateRenderTrainerPokes(newPoke))
        .catch(err => console.log(err))

    }

    function deletePokemon(pokeId) {
        url = POKEMONS_URL + "/" + pokeId;

        const fetchOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }        
        }

        fetch(url, fetchOptions)
        .then(resp => resp.json())
        .catch(err => console.log(err))

    }

    document.addEventListener("click", e =>{
        if (e.target.textContent === "Add Pokemon" ) {
            getPokemon(e.target.dataset.trainerId)
            
        } else if (e.target.textContent === "Release" ){
            releasePokemon(e.target)
        }
    })

    getTrainers();
    // getPokemon(6);

})

