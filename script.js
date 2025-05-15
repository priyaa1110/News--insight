const apiKey = "63e2e2243a5f4357a2822e1e16abb456";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("india"));

function reload(){
    window.location.reload();
}

let curSelectedNav = null;

async function fetchNews(query){
    try {
        console.log("Fetching news for query:", query);
        const response = await fetch(`${url}${query}&apiKey=${apiKey}`);
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if(!data.articles || data.articles.length === 0) {
            document.getElementById('cards-container').innerHTML = `<p>No articles found for "${query}".</p>`;
            return;
        }

        bindData(data.articles);
    } catch(error) {
        document.getElementById('cards-container').innerHTML = `<p>Error loading news: ${error.message}</p>`;
        console.error("Fetch error:", error);
    }
}

function bindData(articles){
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach(article => {
        if(!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article){
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title || "No Title";
    newsDesc.innerHTML = article.description || "No Description";

    const date = new Date(article.publishedAt).toLocaleString("en-US",{
        timeZone : "Asia/Jakarta"
    });

    newsSource.innerHTML  = `${article.source.name || "Unknown Source"} • ${date}`;

    cardClone.firstElementChild.addEventListener("click",()=>{
        window.open(article.url,"_blank");
    });
}

function onNavItemClick(id){
    fetchNews(id);
    if(curSelectedNav) curSelectedNav.classList.remove("active");
    const navItem = document.getElementById(id);
    navItem.classList.add("active");
    curSelectedNav = navItem;
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click",() => {
    const query = searchText.value.trim();
    if(!query) return;
    fetchNews(query);
    if(curSelectedNav) curSelectedNav.classList.remove("active");
    curSelectedNav = null;
});
