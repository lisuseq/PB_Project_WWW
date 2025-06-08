const dataPath="../data.json";
async function getData(path){
    let raw = await fetch(path);
    let parsed = await raw.json();
    return parsed;
}

//check if works
async function addToCart(id) {
    let basket = window.localStorage.getItem("basket");
    if (basket == null) {
        window.localStorage.setItem("basket",id+"-"+'1'+";");
    }else{
        let array = basket.split(";");
        console.log("-----"+id+"-------");
        let newArray="";
        let appendCheck=0;
        for (let i = 0; i < array.length-1; i++) {
            let record = array[i].split("-");
            if (record[0]==id) {
                record[1]++;
                appendCheck=1;
            }
            newArray+= record[0]+"-"+record[1]+";";

        }
        if (appendCheck==0) {
            newArray += id+"-"+'1'+";";
        }
        window.localStorage.setItem("basket",newArray);


    }
}

async function goToBasket() {
    window.location.href='/basket.html';
}


async function generatePage(){
 
const mainContainer = document.getElementById("content");
const array = await getData(dataPath);
console.log("Wykonanie skryptu");
console.log(array);
const searchParams = new URLSearchParams(window.location.search);
const query = searchParams.get('phrase');
const queryLen = query.length;


//top bar
const searchInfo = document.createElement("div");
searchInfo.innerHTML = '<p> Znaleziono  <p id="count">0</p> wystąpień frazy '+'"'+query+'"'+".</p>"; //change to txt!!!
mainContainer.appendChild(searchInfo);
let count = 0;
const counter = document.getElementById("count");

for (let i = 0; i < array.length; i++) {
    console.log("Iteracja nr: " +i);
    let obj = array[i];


    //ADD SITUATUION WHEN NO PRODS FOUND ok BUT WHEN 1 PRODUCT DOESNT WORK AND SAYS ZERO FOUND
    let check=false;
    let z=0;
    let plhdrTxt=obj["name"].toLowerCase();
    for (let j = 0; j < plhdrTxt.length; j++) {

        if (plhdrTxt[j]==query[z].toLowerCase()) {
            z++;
            if (z==queryLen) {
                console.log("Pasuje query do "+ plhdrTxt);
                check=true;
                break;
            }
        }else{
            z=0;
        }
    }
    if (check) {
    console.log("Iteracja poprawna nr: " +i);
    count++;
    counter.innerText=count;

    const productContainer = document.createElement("div"); //float-left split to 2 divs

    productContainer.addEventListener("click",()=>{window.location.href='/product.html?id='+i} );


    productContainer.setAttribute("id",i);
    productContainer.setAttribute("class","product");
    productContainer.setAttribute("class","product");



    const imgContainer = document.createElement("div");
    const img = document.createElement("img");
    let path = (obj.images && obj.images.length) ? obj.images[0] : "../images/" + obj.id + ".webp";
    img.setAttribute("src", path);
    img.setAttribute("width","225px");
    img.setAttribute("height","250px");
    img.setAttribute("alt","obrazek przedstawiający "+obj.name);
    imgContainer.appendChild(img);
    productContainer.appendChild(imgContainer);
    imgContainer.setAttribute("class","imgContainer");



    const dataContainer = document.createElement("div"); //deffinitely change position to grids
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
    price.innerHTML = "Cena: " + obj.price +" zł";
    dataRight.appendChild(price);


    const button = document.createElement("button");
    button.innerHTML = "Dodaj do koszyka";
    button.setAttribute("id","add_to_cart");
    button.addEventListener("click",(e)=>{e.stopPropagation()});
    dataRight.appendChild(button); //store id in cookies/session

    const button2 = document.createElement("button");
    button2.innerHTML = "Kup Teraz";
    button2.setAttribute("id","buy_now");
    button2.addEventListener("click",(e)=>{e.stopPropagation()});
    dataRight.appendChild(button2); //store id in cookies/session + go to cart/buy page immediately

    dataRight.setAttribute("class","dataRight");
    dataLeft.setAttribute("class","dataLeft");
    dataContainer.appendChild(dataRight);
    productContainer.appendChild(dataContainer);



    //linkContainer.appendChild(productContainer);




    //add div for name,button,price,short description


    //add div for name,button,price,short description

    mainContainer.appendChild(productContainer);
    }
    if (count==0) {
        const response = document.createElement("div");
        response.innerHTML = '<p> Nie znaleziono żadnych produktów zawierających frazę: "'+query+'" </p>'; //change to txt!!!
        mainContainer.removeChild(searchInfo);
        mainContainer.appendChild(response);
    }
}

}

