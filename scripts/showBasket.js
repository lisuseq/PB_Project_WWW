const dataPath = "../data.json";
let productsData = null;

async function getData(path) {
    const raw = await fetch(path);
    const parsed = await raw.json();
    return parsed;
}

async function deleteObj(ID) {
    let basket = window.localStorage.getItem("basket");
    if (!basket || !productsData) return;

    let array = basket.split(";");
    let newArrayString = "";
    let newAmount = 0;
    let itemRemovedCompletely = false;

    for (let i = 0; i < array.length; i++) {
        if (!array[i]) continue;
        let record = array[i].split("-");
        let currentID = record[0];
        let currentAmount = parseInt(record[1]);

        if (currentID === ID) {
            currentAmount--;
            newAmount = currentAmount;
        }

        if (currentAmount > 0) {
            newArrayString += currentID + "-" + currentAmount + ";";
        } else if (currentID === ID) {
            itemRemovedCompletely = true;
        }
    }
    window.localStorage.setItem("basket", newArrayString);

    if (itemRemovedCompletely) {
        document.getElementById(ID).remove();
    } else {
        const priceElement = document.getElementById("price" + ID);
        const product = productsData[ID];
        priceElement.innerHTML = `Cena : ${product.price} zł, szt : ${newAmount}`;
    }

    let totalPayment = 0;
    const finalBasket = window.localStorage.getItem("basket");
    if (finalBasket) {
        const queryArr = finalBasket.split(";");
        for (let i = 0; i < queryArr.length; i++) {
            if (!queryArr[i]) continue;
            const details = queryArr[i].split("-");
            totalPayment += parseInt(details[1]) * productsData[details[0]].price;
        }
    }

    const sumElement = document.getElementById("sum");
    if (sumElement) {
        sumElement.textContent = `Do zapłaty: ${totalPayment.toFixed(2)} zł`;
    }
    
    if (!finalBasket || finalBasket.trim() === "") {
        const summaryContainer = document.querySelector(".basket-summary");
        if (summaryContainer) {
            summaryContainer.remove();
        }
        const mainContainer = document.getElementById("content");
        const emptyContainer = document.createElement("div");
        emptyContainer.setAttribute("class", "product-basket empty-basket");
        const emptyDescription = document.createElement("p");
        emptyDescription.innerHTML = "Wygląda na to, że twój koszyk jest pusty. Wypełnijmy go! <a href='/index.html'>Kliknij tutaj, aby wrócić na stronę główną</a>";
        emptyContainer.appendChild(emptyDescription);
        mainContainer.appendChild(emptyContainer);
    }
}

async function clearCart() {
    window.localStorage.removeItem("basket");
    window.location.href = '/index.html'; 
}

async function generatePage() {
    const mainContainer = document.getElementById("content");
    productsData = await getData(dataPath);
    let basket = window.localStorage.getItem("basket");
    let totalPayment = 0;
    let itemCount = 0;

    if (basket) {
        const queryArr = basket.split(";");
        for (let i = 0; i < queryArr.length; i++) {
            if (!queryArr[i]) continue;

            const details = queryArr[i].split("-");
            const ID = details[0];
            const amount = parseInt(details[1]);
            
            let obj = productsData[ID];
            if (!obj) continue;

            totalPayment += amount * obj.price;
            itemCount++;

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
                e.stopPropagation();
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
        const emptyContainer = document.createElement("div");
        emptyContainer.setAttribute("class", "product-basket empty-basket");
        const emptyDescription = document.createElement("p");
        emptyDescription.innerHTML = "Wygląda na to, że twój koszyk jest pusty. Wypełnijmy go! <a href='/index.html'>Kliknij tutaj, aby wrócić na stronę główną</a>";
        emptyContainer.appendChild(emptyDescription);
        mainContainer.appendChild(emptyContainer);
    } else {
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