"use strict";
function openHttpRequest(method, url, mimeType) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response);
                }
                else {
                    reject(xhr.responseText);
                }
            }
        };
        xhr.open(method, url);
        if (mimeType) {
            xhr.overrideMimeType(mimeType);
        }
        xhr.send();
    });
}
function search(searchTerm) {
    return new Promise((resolve, reject) => {
        openHttpRequest("GET", `http://api.technicpack.net/search?build=999&q=${encodeURIComponent(searchTerm)}`, "application/json")
            .then((value) => {
            resolve(value);
        })
            .catch((reason) => {
            reject(reason);
        });
    });
}
let searchBar = document.getElementById("searchBar");
searchBar.addEventListener("keyup", (evt) => {
    if (evt.key === "Enter") {
        search(searchBar.value);
        searchBar.blur();
        evt.preventDefault();
    }
});
