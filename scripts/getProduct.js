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
    }

}

}