let apiKey = 'AIzaSyAo5IUZzG3jLpe0QiAVIzfn1EhF8muBR2o';
let searchEngineId = 'c5352ca746dff43a7';
let query = document.querySelector(".search_input");
let search = document.querySelector(".search_btn");
let outputArea = document.querySelector(".output")
let output = document.querySelector(".output-container")
let container = document.querySelector(".container")
let outputSearch = document.querySelector(".output_query");
let mainContainer = document.querySelector(".main-container")
let outputSearchBtn = document.querySelector("#outputQuerySearch")
let containerImg = document.querySelector(".google_image_output")
let num = 20;
output.style.display = "none"
function fetchContent(query) {
  fetch(`https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query.value)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Unable to reach the website");
      }
      return response.json();
    })
    .then(data => {
      console.log(data.items);
      displayContent(data.items);
    })
    .catch(error => {
      console.error("Error:", error.message);
    });
}

function displayContent(items) {
  container.style.display = "none";
  // mainContainer.style.justifyContent = "flex-start"
  output.style.display = "flex";
  outputArea.innerHTML = "";

  items.forEach(element => {
    mainContainer.style.justifyContent = "flex-start";
    
    outputArea.innerHTML += `
    <div class="output-element">
      <link rel="icon" href="${element.link}" type="image/png">
      <h1 class="output-heading">${element.title}</h1>
      <p class="output-link">${element.link}</p>
      <a class="output-title" href="${element.link}" target="_blank">${element.title}</a>
      <p class="output-snippet"><span>${element.title}</span>${element.snippet}</p>
    </div>`;
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && query.value.trim() !== "") {
    fetchContent(query);
    query.value=''
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && outputSearch.value.trim() !== "") {
    fetchContent(outputSearch);
  }
});

outputSearchBtn.addEventListener("click", () => {
  if (outputSearch.value.trim() !== "") {
    fetchContent(outputSearch);
  }
});

containerImg.addEventListener("click", () => {
  location.reload();  
});

search.addEventListener("click",()=>{
  if (query.value.trim() !== "") {
    fetchContent(query);
  }
})

document.querySelector(".feeling_lucky").addEventListener("click",()=>{
  window.location.href = "https://doodles.google/" 
})