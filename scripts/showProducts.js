const dataPath="../data.json";
async function getData(path){
    let raw = await fetch(path);
    let parsed = await raw.json();
    return parsed;
}

async function generatePage(){
 
const mainContainer = document.getElementById("content");
const array = await getData(dataPath);
console.log("Wykonanie skryptu");
console.log(array);
for (let i = 0; i < array.length; i++) {
    console.log("Iteracja nr: " +i);
    // main container:
    // { 
    // productContainer : 
    // { 
    //      imgContainer: Image, 
    //      dataContainer: 
    //      {
    //          on left[1.name, 2.short description] 
    //          on right[1.price, 2.button]
    //      }
    // }
    //
    let obj = array[i];

    const productContainer = document.createElement("div"); //float-left split to 2 divs

    productContainer.addEventListener("click",()=>{window.location.href='/product.html?id='+i} );


    productContainer.setAttribute("id",i);
    productContainer.setAttribute("class","product");
    productContainer.setAttribute("class","product");



    const imgContainer = document.createElement("div");
    const img = document.createElement("img");
    let path="../images/"+obj.id+".webp";
    img.setAttribute("src",path);
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

    mainContainer.appendChild(productContainer);
}

}