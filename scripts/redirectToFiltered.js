async function activateSearch(phrase) {
    console.log(phrase);
    if (phrase===null || phrase === " " || phrase === "") {
        window.location.href = "../index.html";
    }else{
        window.location.href = "../filtered.html?phrase="+phrase;
    }

}