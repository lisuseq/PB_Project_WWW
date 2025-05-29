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
const searchParams = new URLSearchParams(window.location.search);

for (let i = 0; i < array.length; i++) {
    if (searchParams.get('id')==i)
    {
        let obj = array[i];

        const priceDiv = document.getElementById("price");
        priceDiv.innerHTML = obj.price;

        const headerDiv = document.getElementById("productHeader");
        headerDiv.innerHTML = obj.name;

        const imageAnchor = document.getElementById("imageAnchor");
        imageAnchor.setAttribute("src","images\\"+obj.id+".webp");
        imageAnchor.setAttribute("alt","Obrazek przedstawiający "+obj.name);

        const descriptionParagraph = document.getElementById("descrP");
        descriptionParagraph.innerHTML = obj.description;

        const detailsTab = document.createElement("table");
        const detailsArray = obj.details.split(";");
        for (let j = 0; j < detailsArray.length; j++) {
            const element = detailsArray[j];
            const splitElement = detailsArray[j].split(":");
            const trAnchor = document.createElement("tr");
            trAnchor.innerHTML = "<td>"+splitElement[0]+"</td> <td>"+splitElement[1]+"</td>"; 
            detailsTab.appendChild(trAnchor);
        }
        const detailsDiv = document.getElementById("detailsDiv");
        detailsDiv.appendChild(detailsTab);
    }

}

}