const dataPath="../data.json";
async function getData(path){
    let raw = await fetch(path);
    let parsed = await raw.json();
    return parsed;
}

async function deleteObj(ID,itemPrice) {
    let basket = window.localStorage.getItem("basket");
    let array = basket.split(";");
    console.log("-----"+ID+"-------");
    let newArray="";
    for (let i = 0; i < array.length-1; i++) {
        let record = array[i].split("-");
        if (record[0]==ID) {
            record[1]--;
            const priceDiv = document.getElementById("price"+ID);
            const sumDiv = document.getElementById("sum");

            //price change
            let priceContent = priceDiv.innerHTML;
            let arrCont = priceContent.split(":");
            let changedCount = --arrCont[2];
            priceDiv.innerHTML = arrCont[0]+" :"+arrCont[1]+" :"+changedCount;

            //sum change
            let sumContent = sumDiv.innerHTML;
            let arrSum = sumContent.split(":");
            let changedSum = arrSum[1]-itemPrice;
            sumDiv.innerHTML = arrSum[0]+" :"+changedSum.toFixed(2);
        }
        if (record[1]>0) {
            newArray+= record[0]+"-"+record[1]+";";
        }else{
            window.location.href='/basket.html';
        }   
    }

    window.localStorage.setItem("basket",newArray);

}

async function clearCart() {
    window.localStorage.removeItem("basket");
    window.location.href='/index.html';
}

async function generatePage(){
    const mainContainer = document.getElementById("content");
    const array = await getData(dataPath);
    console.log("Wykonanie skryptu");
    console.log(array);
    let basket = window.localStorage.getItem("basket");
    let queryArr;
    let count = 0;
    let payment = 0;

    if (basket != null) {
        queryArr = basket.split(";");
        for (let i = 0; i < queryArr.length; i++) {
            const details = queryArr[i].split("-");
            const ID = details[0];
            const amount = details[1];
            console.log("Iteracja nr: " +i+ "Element nr: "+ID);
            if (!ID) {
                console.log("Pusty rekord");
                continue;
            }
            let obj = array[ID];
            payment += amount*obj.price;
            console.log("Ktaz:"+amount+" ; "+obj.price+" ; "+payment);
            count++;
            const productContainer = document.createElement("div"); //float-left split to 2 divs

            productContainer.addEventListener("click",()=>{window.location.href='/product.html?id='+i} );


            productContainer.setAttribute("id",ID);
            productContainer.setAttribute("class","product-basket"); // IMPORTANT CHANGE IN CSS

            //doesnt scale!!!!!
            const imgContainer = document.createElement("div");
            const img = document.createElement("img");
            let path = (obj.images && obj.images.length) ? obj.images[0] : "../images/" + obj.id + ".webp";
            img.setAttribute("src", path); //path
            img.setAttribute("width","225px"); // 225
            img.setAttribute("height","150px"); //  250
            img.setAttribute("alt","obrazek przedstawiający "+obj.name);
            imgContainer.appendChild(img);
            productContainer.appendChild(imgContainer);
            imgContainer.setAttribute("class","imgContainer");


            const dataContainer = document.createElement("div");
            const dataLeft = document.createElement("div");
            const title = document.createElement("h1");
            title.innerHTML = obj.name;
            dataLeft.appendChild(title);
            dataContainer.setAttribute("class","dataContainer");

            const description = document.createElement("p");
            description.innerHTML = obj.description;
            dataLeft.appendChild(description);
            dataContainer.appendChild(dataLeft);


            const dataRight = document.createElement("div");
            const price = document.createElement("h3");
            price.setAttribute("id","price"+ID);
            price.innerHTML = "Cena : " + obj.price +" zł, szt :"+amount;
            dataRight.appendChild(price);


            const button = document.createElement("button");
            button.innerHTML = "Usuń z koszyka";
            button.setAttribute("id","add_to_cart");
            //button.addEventListener("click",addToCart(obj.id)); //NEW
            button.addEventListener("click",((e)=>{e.stopPropagation();deleteObj(ID,obj.price)}));
            dataRight.appendChild(button); //store id in cookies/session

            dataRight.setAttribute("class","dataRight");
            dataLeft.setAttribute("class","dataLeft");
            dataContainer.appendChild(dataRight);
            productContainer.appendChild(dataContainer);

            mainContainer.appendChild(productContainer);

        }

        console.log(count);
    }

    if (count==0) {
        // WYCENTRUJ PLSLSLSLSLS
        const mainContainer = document.getElementById("content");
        const productContainer = document.createElement("div");
        productContainer.setAttribute("class","product-basket");
        const description = document.createElement("p");
        description.setAttribute("display","flex");
        description.setAttribute("align-items","center");
        description.innerHTML = "Wygląda na to, że twój koszyk jest pusty. Wypełnijmy go! <a href='/index.html'>Kliknij mnie aby wrócić na stronę główną </a>";
        productContainer.appendChild(description);
        mainContainer.appendChild(productContainer);
    }else{

        const productContainer = document.createElement("div");
        productContainer.setAttribute("class","product-basket");

        //doesnt scale!!!!!

        const dataContainer = document.createElement("div");
        const dataLeft = document.createElement("div");
        const title = document.createElement("h1");
        title.innerHTML = "Podsumowanie koszyka:";
        dataLeft.appendChild(title);
        dataContainer.setAttribute("class","dataContainer");

        const dataRight = document.createElement("div");
        const price = document.createElement("h1");
        price.setAttribute("id","sum");
        price.innerHTML = "Do zapłaty  :"+payment;
        dataRight.appendChild(price);

        dataRight.setAttribute("class","dataRight");
        dataLeft.setAttribute("class","dataLeft");
        dataContainer.appendChild(dataRight);
        productContainer.appendChild(dataContainer);

        const button = document.createElement("button");
        button.innerHTML = "Zamów";
        button.setAttribute("id","add_to_cart");
        button.addEventListener("click",clearCart);
        dataRight.appendChild(button); //store id in cookies/session

        mainContainer.appendChild(productContainer);
    }
}