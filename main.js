//Content node's
const homeNode = document.querySelector("div.home");
const detailNode = document.querySelector("div.detail");
const favNode = document.querySelector("div.fav");

//Home page button's - 
const homeBut = document.querySelector("nav button.home");
const detailBut = document.querySelector("nav button.detail");
const favBut = document.querySelector("nav button.fav");
const allButtons = document.querySelectorAll("nav button");

//Variable that checks if user is on Detail page or Fav page
let isOnFavPage;

//Adding the initial data (HOME PAGE)
function loadHome(){

    allButtons.forEach((eachBut) => eachBut.classList.remove("btn-primary"));
    homeBut.classList.add("btn-primary");

    detailNode.innerHTML = "";
    favNode.innerHTML = "";
    
    homeNode.innerHTML += `
    <h6 class="display-6" style="text-decoration:underline;">Welcome to Hero Finder Webpage</h6>
            <ul>
                <li>The webpage use's data from API to show the different super-hero's, display individual hero's statistics, an option to add them to the favourite's.</li>
                <li>Allows data persistence so data added to favourite persist's even if the browser is closed.</li>
                <li>API - <a href="https://superheroapi.com/">https://superheroapi.com/</a></li>
            </ul>

            <div class="home-photo">
                <img src="https://media.istockphoto.com/vectors/vector-superhero-silhouette-with-sunburst-effect-background-vector-id1162040662?k=20&m=1162040662&s=612x612&w=0&h=pjtxRm3sCJvvcPatDs4cNpU9svjaGnrcGbl8v62MeRQ=" alt="">
            </div>

            <h6 class="display-6">Happy Hunting!</h6>
    `;

}
loadHome();


let detailResult;
let finalFavResult;
let favResult = [];



function printData(result, node, favPageState){

    node.innerHTML = "";

    result.forEach((eachRes) => {
        node.innerHTML +=`
        <div class="card result" style="width: 10rem;">
            <img class="card-img-top" src="${eachRes.image.url}" alt="Card image cap">
            <div class="card-body">
            <p><strong>${eachRes.name}</strong></p>
            </div>
            <button class="btn btn-dark more-info modal-btn">More info!</button>
            ${favPageState ? '<button class="btn btn-danger remove-fav">Remove from Fav</button>' : '<button class="btn btn-danger add-fav">Add to fav</button>' }
        </div>

        <div class="modal-bg">
            <div class="modal_">
                <div class="card" style="width: 18rem;">
                <img class="card-img-top" src="${eachRes.image.url}" alt="Card image cap">
                <div class="card-body">
                <p><strong>${eachRes.name}</strong></p>
                </div>
                <strong>Power Stats</strong>
                <ul class="list-group list-group-flush">
                    <li><strong>Combat : </strong>${eachRes.powerstats.combat}</li>
                    <li><strong>Durability : </strong>${eachRes.powerstats.durability}</li>
                    <li><strong>Inteligence : </strong>${eachRes.powerstats.intelligence}</li>
                    <li><strong>Power : </strong>${eachRes.powerstats.power}</li>
                    <li><strong>Speed : </strong>${eachRes.powerstats.speed}</li>
                    <li><strong>Strength : </strong>${eachRes.powerstats.strength}</li>
                </ul>
                <button class="btn btn-primary close">Click to close</button>
            </div>
        </div>
        `;
    })


    //More info button
    const allMoreInfo = document.querySelectorAll("div.card button.more-info");

    allMoreInfo.forEach((eachButInfo, index) => {
        
        eachButInfo.addEventListener("click", () => {
            const allModal = document.querySelectorAll("div.modal-bg");
            allModal[index].classList.add("bg-active");

            const allClose = document.querySelectorAll("div.modal-bg button.close");
            allClose[index].addEventListener("click", () => {
                allModal[index].classList.remove("bg-active");
            })
        })
    })

    //Add to fav button
    const allFavButton = document.querySelectorAll("div.result button.add-fav");
    
    allFavButton.forEach((eachFavBut, index) => {
    eachFavBut.addEventListener("click", (event) => {
        favResult.push(result[index]);
        event.target.disabled = true;
        })
    })

    //Remove from fav button
    const allRemButton = document.querySelectorAll("div.result button.remove-fav");

    allRemButton.forEach((eachBut,index) => {
        eachBut.addEventListener("click", (event) => {
            
            //Find the parent element and delete the node and also delete from the favlist;
            event.target.parentNode.remove();
            finalFavResult.splice(index,1);

            console.log(finalFavResult);
        })
    })
    
}

//Detail page
function loadDetail(event){
    
    
    allButtons.forEach((eachBut) => eachBut.classList.remove("btn-primary"));
    event.target.classList.add("btn-primary");

    homeNode.innerHTML = "";
    favNode.innerHTML = "";

    isOnFavPage = false;

    detailNode.innerHTML += `
    <label for="name">Search by Name</label>
    <input type="text" id="name">
    `;

    const inpVal = document.querySelector("input");

    //Creating a result node where results will be displayed
    const resultNode = document.createElement("div");
    resultNode.classList.add("result-container");
    detailNode.appendChild(resultNode);

    let searchBy;

    //Debouncing
    const myDebounce = (func, delay) => {

        let timer;

        function debouncedFunction(){
            clearTimeout(timer);
            timer = setTimeout(func,delay);
        }

        return debouncedFunction;
    }

    async function setSearchBy(){
        searchBy = inpVal.value;

        //Gather the result data
        const resp = await fetch(`https://www.superheroapi.com/api.php/4729783740406060/search/${searchBy}`);
        const finalResp = await resp.json();

        detailResult = finalResp.results;

        //Function that prints the data in the respective node content
        printData(detailResult, resultNode, isOnFavPage);
    }

    inpVal.addEventListener("input", myDebounce(setSearchBy,400));
}
// loadDetail();




//Favourite page
function loadFav(event){

    isOnFavPage = true;

    allButtons.forEach((eachBut) => eachBut.classList.remove("btn-primary"));
    event.target.classList.add("btn-primary");

    homeNode.innerHTML = "";
    detailNode.innerHTML = "";

    //Filter out the duplicate's from favResult
    finalFavResult = Array.from(new Set(favResult.map(a => a.id)))
    .map(id => {
    return favResult.find(a => a.id === id)
    })

    printData(finalFavResult ,favNode ,isOnFavPage);
}

homeBut.addEventListener("click", loadHome);
detailBut.addEventListener("click", loadDetail);
favBut.addEventListener("click", loadFav);