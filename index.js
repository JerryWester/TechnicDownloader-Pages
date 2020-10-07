"use strict";
function requestModPackInfo(slug) {
    return new Promise((resolve, reject) => {
        let header = new Headers({
            "User-Agent": "Mozilla/5.0 (Java) TechnicLauncher/4.591",
            "Host": "api.technicpack.net",
            "Accept": "text/html, image/gif, image/jpeg, *; q=.2, */*; q=.2",
            "Connection": "keep-alive"
        });
        let request = new Request(`https://technicdownloader-proxy.herokuapp.com/http://api.technicpack.net/modpack/${slug}?build=999`, {
            method: "GET",
            headers: header,
            credentials: "omit",
            cache: "default",
            redirect: "follow",
            referrer: "no-referrer"
        });
        fetch(request)
            .then(response => response.json())
            .then(resolve)
            .catch(reject);
    });
}
function requestSolderPackInfo(slug) {
    return new Promise((resolve, reject) => {
        let header = new Headers({
            "User-Agent": "Mozilla/5.0 (Java) TechnicLauncher/4.591",
            "Host": "api.technicpack.net",
            "Accept": "text/html, image/gif, image/jpeg, *; q=.2, */*; q=.2",
            "Connection": "keep-alive"
        });
        let request = new Request(`https://technicdownloader-proxy.herokuapp.com/http://solder.technicpack.net/api/modpack/${slug}`, {
            method: "GET",
            headers: header,
            credentials: "omit",
            cache: "default",
            redirect: "follow",
            referrer: "no-referrer"
        });
        fetch(request)
            .then(response => response.json())
            .then(resolve)
            .catch(reject);
    });
}
function requestSolderPackBuildInfo(slug, version) {
    return new Promise((resolve, reject) => {
        let header = new Headers({
            "User-Agent": "Mozilla/5.0 (Java) TechnicLauncher/4.591",
            "Host": "api.technicpack.net",
            "Accept": "text/html, image/gif, image/jpeg, *; q=.2, */*; q=.2",
            "Connection": "keep-alive"
        });
        let request = new Request(`https://technicdownloader-proxy.herokuapp.com/http://solder.technicpack.net/api/modpack/${slug}/${version}`, {
            method: "GET",
            headers: header,
            credentials: "omit",
            cache: "default",
            redirect: "follow",
            referrer: "no-referrer"
        });
        fetch(request)
            .then(response => response.json())
            .then(resolve)
            .catch(reject);
    });
}
function search(searchTerm) {
    return new Promise((resolve, reject) => {
        let header = new Headers({
            "User-Agent": "Mozilla/5.0 (Java) TechnicLauncher/4.591",
            "Host": "api.technicpack.net",
            "Accept": "text/html, image/gif, image/jpeg, *; q=.2, */*; q=.2",
            "Connection": "keep-alive"
        });
        let request = new Request(`https://technicdownloader-proxy.herokuapp.com/http://api.technicpack.net/search?build=999&q=${encodeURIComponent(searchTerm)}`, {
            method: "GET",
            headers: header,
            credentials: "omit",
            cache: "default",
            redirect: "follow",
            referrer: "no-referrer"
        });
        fetch(request)
            .then(response => response.json())
            .then(resolve)
            .catch(reject);
    });
}
function parseModPackInfo(modpackInfo) {
    let htmlModInfo = document.createElement("div");
    htmlModInfo.classList.add("mod-info");
    let displayName = document.createElement("p");
    displayName.innerHTML = `name: ${modpackInfo.displayName}`;
    let platformUrl = document.createElement("p");
    platformUrl.innerHTML = `platform url: <a href=${modpackInfo.platformUrl}>${modpackInfo.platformUrl}</a>`;
    let url = document.createElement("p");
    let downloadLink = document.createElement("a");
    downloadLink.href = (modpackInfo.solder !== null) ? `${modpackInfo.solder}modpack/${modpackInfo.name}` : modpackInfo.url;
    downloadLink.innerHTML = downloadLink.href;
    if (modpackInfo.solder !== null) {
        downloadLink.onclick = function (evt) {
            evt.preventDefault();
            resultsList.innerHTML = "Fetching modpack info, please be patient...";
            requestSolderPackInfo(modpackInfo.name)
                .then((solderModpackInfo) => {
                resultsList.innerHTML = "";
                resultsList.append(parseSolderPackInfo(solderModpackInfo));
            })
                .catch((reason) => {
                console.log(reason);
                resultsList.innerHTML = "Issue processing request, please check your Javascript console, or wait and try again.";
            });
        };
    }
    url.append("download url: ", downloadLink);
    htmlModInfo.append(displayName, platformUrl, url);
    return htmlModInfo;
}
function parseSolderPackInfo(solderPackInfo) {
    let htmlSolderPackInfo = document.createElement("div");
    htmlSolderPackInfo.classList.add("solder-pack-info");
    let htmlVersionSelect = document.createElement("select");
    let htmlOptgroupRecommended = document.createElement("optgroup");
    htmlOptgroupRecommended.label = "recommended";
    let htmlRecommended = document.createElement("option");
    htmlRecommended.value = solderPackInfo.recommended;
    htmlRecommended.text = htmlRecommended.value;
    let htmlOptgroupLatest = document.createElement("optgroup");
    htmlOptgroupLatest.label = "latest";
    let htmlLatest = document.createElement("option");
    htmlLatest.value = solderPackInfo.latest;
    htmlLatest.text = htmlLatest.value;
    htmlOptgroupRecommended.append(htmlRecommended);
    htmlOptgroupLatest.append(htmlLatest);
    let htmlOptgroupOther = document.createElement("optgroup");
    htmlOptgroupOther.label = "Other";
    for (let i = 0; i < solderPackInfo.builds.length; i++) {
        let htmlOption = document.createElement("option");
        htmlOption.value = solderPackInfo.builds[i];
        htmlOption.text = htmlOption.value;
        htmlOptgroupOther.append(htmlOption);
    }
    htmlVersionSelect.append(htmlOptgroupRecommended, htmlOptgroupLatest, htmlOptgroupOther);
    htmlVersionSelect.selectedIndex = htmlRecommended.index;
    let htmlBuildInfo = document.createElement("div");
    htmlBuildInfo.innerHTML = "Fetching pack info, please be patient...";
    requestSolderPackBuildInfo(solderPackInfo.name, htmlVersionSelect.value)
        .then((solderBuildInfo) => {
        htmlBuildInfo.innerHTML = "";
        htmlBuildInfo.append(parseSolderPackBuildInfo(solderBuildInfo));
    })
        .catch((reason) => {
        console.log(reason);
        htmlBuildInfo.innerHTML = "Issue processing request, please check your Javascript console, or wait and try again.";
    });
    htmlVersionSelect.oninput = function () {
        htmlBuildInfo.innerHTML = "Fetching pack info, please be patient...";
        requestSolderPackBuildInfo(solderPackInfo.name, htmlVersionSelect.value)
            .then((solderBuildInfo) => {
            htmlBuildInfo.innerHTML = "";
            htmlBuildInfo.append(parseSolderPackBuildInfo(solderBuildInfo));
        })
            .catch((reason) => {
            console.log(reason);
            htmlBuildInfo.innerHTML = "Issue processing request, please check your Javascript console, or wait and try again.";
        });
    };
    htmlSolderPackInfo.append(htmlVersionSelect, htmlBuildInfo);
    return htmlSolderPackInfo;
}
function parseSolderPackBuildInfo(solderPackInfo) {
    let htmlSolderPackInfo = document.createElement("div");
    htmlSolderPackInfo.classList.add("solder-pack-info");
    let warning = document.createElement("p");
    warning.innerHTML = "Basemods need to be combined with minecraft.jar. If you're using MultiMC, use \"Add to Minecraft.jar\" in the Version tab. Usually comes with Forge.";
    let minecraft = document.createElement("p");
    minecraft.innerHTML = `minecraft version: ${solderPackInfo.minecraft}`;
    let forge = document.createElement("p");
    forge.innerHTML = `forge version: ${solderPackInfo.forge}`;
    let modsList = document.createElement("div");
    for (let i = 0; i < solderPackInfo.mods.length; i++) {
        let htmlModInfo = document.createElement("div");
        let modInfo = solderPackInfo.mods[i];
        let name = document.createElement("p");
        name.innerHTML = `mod name: ${modInfo.name}`;
        let version = document.createElement("p");
        version.innerHTML = `mod version: ${modInfo.version}`;
        let url = document.createElement("p");
        url.innerHTML = `mod download: <a href=${modInfo.url}>${modInfo.url}</a>`;
        htmlModInfo.append(name, version, url);
        modsList.append(htmlModInfo);
    }
    htmlSolderPackInfo.append(warning, minecraft, forge, modsList);
    return htmlSolderPackInfo;
}
function parseSearchResult(searchResult) {
    let htmlSearchResult = document.createElement("div");
    htmlSearchResult.classList.add("search-result");
    let name = document.createElement("p");
    name.innerHTML = `name: ${searchResult.name}`;
    let url = document.createElement("p");
    url.innerHTML = `url: <a href=${searchResult.url}>${searchResult.url}</a>`;
    url.onclick = function (evt) {
        evt.preventDefault();
        resultsList.innerHTML = "Fetching modpack info, please be patient...";
        requestModPackInfo(searchResult.slug)
            .then((value) => {
            resultsList.innerHTML = "";
            resultsList.append(parseModPackInfo(value));
        })
            .catch((reason) => {
            console.log(reason);
            resultsList.innerHTML = "Issue processing request, please check your Javascript console, or wait and try again.";
        });
    };
    htmlSearchResult.append(name, url);
    return htmlSearchResult;
}
let searchBar = document.getElementById("searchBar");
let resultsList = document.getElementById("results");
searchBar.addEventListener("keyup", (evt) => {
    if (evt.key === "Enter") {
        resultsList.innerHTML = "Fetching search results, please be patient...";
        search(searchBar.value)
            .then((value) => {
            resultsList.innerHTML = "";
            for (let i = 0; i < value.modpacks.length; i++) {
                resultsList.append(parseSearchResult(value.modpacks[i]));
            }
            if (value.modpacks.length === 0) {
                resultsList.innerHTML = "Nothing here ¯\\_(ツ)_/¯";
            }
        })
            .catch((reason) => {
            console.log(reason);
            resultsList.innerHTML = "Issue processing request, please check your Javascript console, or wait and try again.";
        });
        searchBar.blur();
        evt.preventDefault();
    }
});
