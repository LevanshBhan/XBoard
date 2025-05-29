function createAccordion(title, id){
    return `<div class="accordion-item" id="card${id}">
    <h2 class="accordion-header" id="heading${id}">
      <button class="accordion-button-edited" id="accordionButton" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${id}" aria-expanded="true" aria-controls="collapse${id}">
        <i class="fa-solid mx-2 fa-angle-down" id="accordionArrow"></i>${title}
      </button>
    </h2>
    <div id="collapse${id}" class="collapse" aria-labelledby="heading${id}" data-bs-parent="#accordionId">
    </div>
  </div>`;
}

function rotateArrow(event){
  //console.log("event :: ", event);
  if(event.target.classList.contains("fa-angle-up")){
    event.target.className = "fa-solid mx-2";
    event.target.classList.add("fa-angle-down");
  }else if(event.target.classList.contains("fa-angle-down")){
    event.target.className = "fa-solid mx-2";
    event.target.classList.add("fa-angle-up");
  }else if(event.target.classList.contains("collapsed")){
    let parent = event.target;
    let children = parent.children[0];
    children.className = "fa-solid mx-2";
    children.classList.add("fa-angle-down");
  }else{
    let parent = event.target;
    let children = parent.children[0];
    children.className = "fa-solid mx-2";
    children.classList.add("fa-angle-up");
  }
}

function createOuterCarousel(id, innerId){
    return `<div id="carouselControls${id}" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner" id="${innerId}">
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselControls${id}" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselControls${id}" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>`;
}

function createInnerCarousel(id, active){
    return `<div class="carousel-item ${active? "active": ""}" id="${id}">
            </div>`;
}

function createCard(item){
    return `<div class="card d-block">
                <img src="${item.enclosure.link}" class="card-img-top img-fluid carousel-img" alt="card image">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted d-inline">${item.author}</h6>
                    <span class="bi bi-dot"></span>
                    <p class="card-subtitle text-secondary d-inline">${new Date(item.pubDate).toLocaleDateString("en-IN")}</p>
                    <p class="card-text pt-4">${item.description}</p>
                    <a href="${item.link}" class="stretched-link" target="_blank"></a>
                </div>
            </div>`;
}

function ID(){
    return Math.random().toString(36).substr(2, 9);
}

async function loadContent(){

    // fetch data from magazines.js
    //pass the urls to accordion
    //create carousal inside the accordion

    //console.log(magazines);
    for(let i=0; i<magazines.length; i++){
        //console.log(magazines[i]);
        let url = magazines[i];
        let response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURI(url)}`);
        let data = await response.json();
        //console.log(data);

        // create an accordion
        let accordionId = ID();
        let accordion = createAccordion(data.feed.title, accordionId);
        document.getElementById("accordionId").innerHTML += accordion;
        
        if(i === 0){
            document.getElementById(`collapse${accordionId}`).classList.add("show");
            document.getElementById("accordionArrow").classList.add("fa-angle-up");
        }

        //create carousel
        let carouselId = ID();
        let carouselInnerId = ID();
        let carousel = createOuterCarousel(carouselId, carouselInnerId);
        document.getElementById(`collapse${accordionId}`).innerHTML = carousel;

        let items = data.items;
        for(let item=0; item<items.length; item++){
            let card = createCard(items[item]);
            
            let innerCarouselCardId = ID();
            let innerCarouselCard = createInnerCarousel(innerCarouselCardId, item == 0);
            
            document.getElementById(carouselInnerId).innerHTML += innerCarouselCard;
            document.getElementById(innerCarouselCardId).innerHTML += card;
        }
    }

    let accordionButtons = document.querySelectorAll('#accordionButton');

    for (i of accordionButtons) {
      i.addEventListener("click", () => {
        //console.log(event);
        rotateArrow(event);
      });
    }
}

loadContent();