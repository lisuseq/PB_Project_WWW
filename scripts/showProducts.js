const dataPath = "../data.json";

async function getData(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Błąd HTTP! Status: ${response.status}`);
    }
    const parsed = await response.json();
    return parsed;
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

async function goToBasket() {
    window.location.href = '/basket.html';
}

async function generatePage() {
    const mainContainer = document.getElementById("content");
    try {
        const array = await getData(dataPath);
        for (let i = 0; i < array.length; i++) {
            let obj = array[i];

            const productContainer = document.createElement("div");
            productContainer.addEventListener("click", () => { window.location.href = '/product.html?id=' + i });
            productContainer.setAttribute("id", i);
            productContainer.setAttribute("class", "product");

            const imgContainer = document.createElement("div");
            imgContainer.setAttribute("class", "imgContainer");
            const img = document.createElement("img");
            let path = (obj.images && obj.images.length) ? obj.images[0] : "../images/" + obj.id + ".webp";
            img.setAttribute("src", path);
            img.setAttribute("alt", "obrazek przedstawiający " + obj.name);
            imgContainer.appendChild(img);
            productContainer.appendChild(imgContainer);

            const dataContainer = document.createElement("div");
            dataContainer.setAttribute("class", "dataContainer");

            const dataLeft = document.createElement("div");
            dataLeft.setAttribute("class", "dataLeft");
            const title = document.createElement("h1");
            title.innerHTML = obj.name;
            const description = document.createElement("p");
            description.innerHTML = obj.description;
            dataLeft.appendChild(title);
            dataLeft.appendChild(description);
            dataContainer.appendChild(dataLeft);

            const dataRight = document.createElement("div");
            dataRight.setAttribute("class", "dataRight");
            const price = document.createElement("h3");

            const priceValue = parseFloat(obj.price);
            if (!isNaN(priceValue)) {
                price.innerHTML = "Cena: " + priceValue.toFixed(2) + " zł";
            } else {
                price.innerHTML = "Cena niedostępna";
            }
            
            dataRight.appendChild(price);

            const button = document.createElement("button");
            button.innerHTML = "Dodaj do koszyka";
            button.setAttribute("id", "add_to_cart");
            button.addEventListener("click", ((e) => { e.stopPropagation(); addToCart(obj.id) }));
            dataRight.appendChild(button);

            const button2 = document.createElement("button");
            button2.innerHTML = "Kup Teraz";
            button2.setAttribute("id", "buy_now");
            button2.addEventListener("click", (e) => { e.stopPropagation() });
            dataRight.appendChild(button2);
            
            dataContainer.appendChild(dataRight);
            productContainer.appendChild(dataContainer);
            mainContainer.appendChild(productContainer);
        }
    } catch (error) {
        console.error("Wystąpił błąd podczas ładowania produktów:", error);
        mainContainer.innerHTML = `
            <div class="error-container">
                <div class="error-icon">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
                <h2>Wystąpił błąd ładowania strony</h2>
                <p>Nie mogliśmy załadować listy produktów. Może to być chwilowy problem z serwerem. Spróbuj odświeżyć stronę za chwilę.</p>
                <a href="/" class="back-to-home-btn">Odśwież stronę</a>
            </div>
        `;
    }
}