const apiKey = "685d645a45cb4ffe830a41b5d171e99d";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("india"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    try {
        const response = await fetch(`${url}${query}&apiKey=${apiKey}`);

        if (!response.ok) {
            console.error('HTTP error', response.status);
            alert(`Error fetching news: ${response.status} ${response.statusText}`);
            return;
        }

        const data = await response.json();
        console.log(data);

        if (!data.articles || data.articles.length === 0) {
            alert("No articles found for your query.");
            return;
        }

        bindData(data.articles);

    } catch (error) {
        console.error('Fetch error:', error);
        alert("Failed to fetch news. Please check your internet connection or API key.");
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach(article => {
        if (!article.urlToImage) return;

        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta"
    });

    newsSource.innerHTML = `${article.source.name} • ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    })
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value.trim();
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
})
