const mainContainer = document.getElementById("content");
const array = JSON.parse("../data.json");
for (let i = 0; i < array.length; i++) {
    let obj = array[i];
    const productContainer = document.createElement("div"); //float-left split to 2 divs
    productContainer.setAttribute("id",i);
    productContainer.setAttribute("class","product");


    const imgContainer = document.createElement("div");
    const img = document.createElement("img");
    let path="/images/"+obj.name+".png";
    img.setAttribute("link",path);
    imgContainer.appendChild(img);


    //add div for name,button,price,short description

    mainContainer.appendChild(productContainer);
}