"use strict";
function openHttpRequest(method, url) {
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
        xhr.send();
    });
}
function search(searchTerm) {
    return new Promise((resolve, reject) => {
        openHttpRequest("GET", `http://api.technicpack.net/search?build=999&q=${encodeURIComponent(searchTerm)}`)
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
