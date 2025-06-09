const dataPath="../data.json";
async function getData(path){
    let raw = await fetch(path);
    let parsed = await raw.json();
    return parsed;
}

async function goToBasket() {
    window.location.href='/basket.html';
}

async function addToCart(id) {
    let basket = window.localStorage.getItem("basket");
    if (basket == null) {
        window.localStorage.setItem("basket", id + "-1;");
    } else {
        let array = basket.split(";");
        let newArray = "";
        let appendCheck = 0;
        for (let i = 0; i < array.length - 1; i++) {
            let record = array[i].split("-");
            if (record[0] == id) {
                record[1]++;
                appendCheck = 1;
            }
            newArray += record[0] + "-" + record[1] + ";";
        }
        if (appendCheck == 0) {
            newArray += id + "-1;";
        }
        window.localStorage.setItem("basket", newArray);
    }
}


async function generatePage(){
 
    const mainContainer = document.getElementById("content");
    const array = await getData(dataPath);
    console.log("Wykonanie skryptu");
    console.log(array);
    const searchParams = new URLSearchParams(window.location.search);

    for (let i = 0; i < array.length; i++) {
        if (searchParams.get('id') == i) {
            let obj = array[i];

            const priceDiv = document.getElementById("price");
            priceDiv.innerHTML = obj.price + "zł";

            const headerDiv = document.getElementById("productHeader");
            headerDiv.innerHTML = obj.name;

            const leftProduct = document.getElementById("leftProduct");

            const images = obj.images && obj.images.length ? obj.images : ["images/" + obj.id + ".webp"];
            box.innerHTML = `
                <div id="carousel" class="carousel">
                    <button id="prevBtn" class="carousel-btn" aria-label="Poprzednie zdjęcie"> < </button>
                    <img id="carouselImage" src="" alt="Obrazek przedstawiający ${obj.name}">
                    <button id="nextBtn" class="carousel-btn" aria-label="Następne zdjęcie"> > </button>
                </div>
            `;
            let current = 0;
            const img = document.getElementById('carouselImage');
            const prev = document.getElementById('prevBtn');
            const next = document.getElementById('nextBtn');

            function showImage(idx) {
                img.src = images[idx];
                img.alt = "Obrazek przedstawiający " + obj.name;
            }
            prev.addEventListener('click', function() {
                current = (current - 1 + images.length) % images.length;
                showImage(current);
            });
            next.addEventListener('click', function() {
                current = (current + 1) % images.length;
                showImage(current);
            });
            showImage(current);

            const descriptionParagraph = document.getElementById("descrP");
            descriptionParagraph.innerHTML = obj.description;

            const detailsTab = document.createElement("table");
            const detailsArray = obj.details.split(";");
            for (let j = 0; j < detailsArray.length; j++) {
                const element = detailsArray[j];
                const splitElement = detailsArray[j].split(":");
                const trAnchor = document.createElement("tr");
                trAnchor.innerHTML = '<td id="cat" >' + splitElement[0]+":" + '</td> <td id="type" >' + splitElement[1] + "</td>";
                detailsTab.appendChild(trAnchor);
            }
            const detailsDiv = document.getElementById("detailsDiv");
            detailsDiv.appendChild(detailsTab);
            
            const addToCartBtn = document.getElementById("add_to_cart");
            const buyNowBtn = document.getElementById("buy_now");

            addToCartBtn.addEventListener('click', () => {
                addToCart(obj.id);
            });

            buyNowBtn.addEventListener('click', () => {
                addToCart(obj.id);
                goToBasket();
            });
        }
    }
}