const dataPath = "../data.json";

async function getData(path) {
    const raw = await fetch(path);
    const parsed = await raw.json();
    return parsed;
}

// Funkcja została uproszczona dla większej stabilności
async function deleteObj(ID) {
    let basket = window.localStorage.getItem("basket");
    if (!basket) return; // Zabezpieczenie na wypadek braku koszyka

    let array = basket.split(";");
    let newArrayString = "";
    let itemFoundAndRemoved = false;

    for (let i = 0; i < array.length; i++) {
        if (!array[i]) continue; // Pomiń puste rekordy
        let record = array[i].split("-");
        let currentID = record[0];
        let currentAmount = parseInt(record[1]);

        if (currentID === ID && !itemFoundAndRemoved) {
            currentAmount--; // Zmniejsz ilość tylko raz
            itemFoundAndRemoved = true;
        }

        if (currentAmount > 0) {
            newArrayString += currentID + "-" + currentAmount + ";";
        }
    }

    window.localStorage.setItem("basket", newArrayString);
    // Odświeżenie strony jest najprostszym i najbardziej niezawodnym sposobem
    // na zaktualizowanie widoku koszyka po zmianach.
    window.location.reload();
}

async function clearCart() {
    window.localStorage.removeItem("basket");
    // Przekierowanie na stronę główną po złożeniu zamówienia
    window.location.href = '/index.html'; 
}

async function generatePage() {
    const mainContainer = document.getElementById("content");
    const productsData = await getData(dataPath);
    let basket = window.localStorage.getItem("basket");
    let totalPayment = 0;
    let itemCount = 0;

    if (basket) {
        const queryArr = basket.split(";");
        for (let i = 0; i < queryArr.length; i++) {
            if (!queryArr[i]) continue; // Pomiń puste rekordy

            const details = queryArr[i].split("-");
            const ID = details[0];
            const amount = parseInt(details[1]);
            
            let obj = productsData[ID];
            if (!obj) continue; // Pomiń, jeśli produkt o danym ID nie istnieje

            totalPayment += amount * obj.price;
            itemCount++;

            // --- Tworzenie elementu produktu w koszyku ---
            const productContainer = document.createElement("div");
            productContainer.setAttribute("id", ID);
            productContainer.setAttribute("class", "product-basket");
            productContainer.addEventListener("click", () => { window.location.href = '/product.html?id=' + ID });

            const imgContainer = document.createElement("div");
            imgContainer.setAttribute("class", "imgContainer");
            const img = document.createElement("img");
            let path = (obj.images && obj.images.length) ? obj.images[0] : `../images/${obj.id}.webp`;
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

            const dataRight = document.createElement("div");
            dataRight.setAttribute("class", "dataRight");
            const price = document.createElement("h3");
            price.setAttribute("id", "price" + ID);
            price.innerHTML = `Cena : ${obj.price} zł, szt : ${amount}`;
            dataRight.appendChild(price);

            const deleteButton = document.createElement("button");
            deleteButton.innerHTML = "Usuń z koszyka";
            deleteButton.setAttribute("class", "btn btn-delete");
            deleteButton.addEventListener("click", (e) => {
                e.stopPropagation(); // Zapobiega przejściu na stronę produktu po kliknięciu przycisku
                deleteObj(ID);
            });
            dataRight.appendChild(deleteButton);

            dataContainer.appendChild(dataLeft);
            dataContainer.appendChild(dataRight);
            productContainer.appendChild(dataContainer);
            mainContainer.appendChild(productContainer);
        }
    }

    if (itemCount === 0) {
        // --- Wyświetlanie informacji o pustym koszyku ---
        const emptyContainer = document.createElement("div");
        emptyContainer.setAttribute("class", "product-basket empty-basket");
        const emptyDescription = document.createElement("p");
        emptyDescription.innerHTML = "Wygląda na to, że twój koszyk jest pusty. Wypełnijmy go! <a href='/index.html'>Kliknij tutaj, aby wrócić na stronę główną</a>";
        emptyContainer.appendChild(emptyDescription);
        mainContainer.appendChild(emptyContainer);
    } else {
        // --- Tworzenie podsumowania koszyka ---
        const summaryContainer = document.createElement("div");
        summaryContainer.setAttribute("class", "basket-summary");

        const textContainer = document.createElement("div");
        textContainer.setAttribute("class", "dataContainer");

        const summaryTitleElement = document.createElement("h1");
        summaryTitleElement.textContent = "Podsumowanie koszyka:";

        const summaryPriceElement = document.createElement("h1");
        summaryPriceElement.setAttribute("id", "sum");
        summaryPriceElement.textContent = `Do zapłaty: ${totalPayment.toFixed(2)} zł`;

        textContainer.appendChild(summaryTitleElement);
        textContainer.appendChild(summaryPriceElement);

        const orderButton = document.createElement("button");
        orderButton.textContent = "Zamów";
        orderButton.setAttribute("class", "btn btn-primary");
        orderButton.addEventListener("click", clearCart);
        
        summaryContainer.appendChild(textContainer);
        summaryContainer.appendChild(orderButton);
        mainContainer.appendChild(summaryContainer);
    }
}