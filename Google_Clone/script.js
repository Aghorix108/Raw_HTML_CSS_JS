let query = document.querySelector(".search_input");
let search = document.querySelector(".search_btn");
let outputArea = document.querySelector(".output")
let output = document.querySelector(".output-container")
let container = document.querySelector(".container")
let outputSearch = document.querySelector(".output_query");
let mainContainer = document.querySelector(".main-container")
let outputSearchBtn = document.querySelector("#outputQuerySearch")
let containerImg = document.querySelector(".google_image_output")
let apps = document.querySelector("#appsIcon");
let navbar = document.querySelector(".navbar")
let nextPage = document.querySelector("#nextPage")
let prevPage = document.querySelector("#previousPage")
let pages = document.querySelector(".pagination-page")
let paginationSection = document.querySelector(".pagination")
let navItems = document.querySelector(".nav-items")
let imageSection = document.querySelector("#imageSection")
let imageOutput = document.querySelector(".image-output")
let allSearch = document.querySelector("#allSearch")
let apiKey = 'AIzaSyDMxVI5ihEvFCv2CbJ6Mpmd--lr9rI2F9o';
let searchEngineId = 'c5352ca746dff43a7';
let start = 1; 
let savedQuery = ""; 
let totalResults = 100; 
let searchType = "text"
output.style.display = "none";
paginationSection.style.display = "none";
document.cookie = "key=value; SameSite=None; Secure";

let fetchContent = (query, pageNum = 1) => { 
  if (query) {
    savedQuery = query.value.trim();
  }

  if (!savedQuery) {
    alert("Please enter a search term.");
    return;
  }

  let baseLink = 'https://www.googleapis.com/customsearch/v1?'
  let q = encodeURIComponent(savedQuery);
  let start = pageNum;
  let url = `${baseLink}key=${apiKey}&cx=${searchEngineId}&q=${q}&start=${start}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("Unable to reach the website. Status code: " + response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      displayContent(data.items); 
      createPaginationButtons(pageNum);
    })
    .catch(error => {
      console.error("Error: Not able to send Request", error.message);
    });
};

let displayContent = (items) => {
  imageOutput.style.display = "none";
  navbar.style.display = "none";
  container.style.display = "none";
  output.style.display = "flex";
  outputArea.innerHTML = ""; 
  paginationSection.style.display = "flex";
  items.forEach(element => {
    mainContainer.style.justifyContent = "flex-start";

    outputArea.innerHTML += `
    <div class="output-element">
      <h1 class="output-heading">${element.title}</h1>
      <p class="output-link">${element.link}</p>
      <a class="output-title" href="${element.link}" target="_blank">${element.title}</a>
      <p class="output-snippet"><span>${element.title}</span>${element.snippet}</p>
    </div>`;
  });
};


let createPaginationButtons = (currentPage) => {
  pages.innerHTML = "";
  let totalPages = Math.min(10, Math.ceil(totalResults / 10)); 

  for (let i = 1; i <= totalPages; i++) {
    let button = document.createElement("a");
    button.className = "pagination-btn";
    button.innerText = i;

    if (i === currentPage) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      let newStart = (i - 1) * 10 + 1;

      let allButtons = document.querySelectorAll(".pagination-btn");
      allButtons.forEach(btn => btn.classList.remove("active"));

      button.classList.add("active");

      fetchContent(null, newStart);
    });

    pages.appendChild(button);
  }
};



nextPage.addEventListener("click", () => {
  start += 10;
  window.scrollTo(0, 0);
  fetchContent(null, start);
});

prevPage.addEventListener("click", ()=> {
  start -= 10;
  if (start < 1) start = 1; 
  window.scrollTo(0, 0);
  fetchContent(null, start);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && query.value.trim() !== "") {
    fetchContent(query);
    query.value = '';
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

search.addEventListener("click", () => {
  if (query.value.trim() !== "") {
    fetchContent(query);
  }
});

document.querySelector(".feeling_lucky").addEventListener("click", () => {
  window.open("https://doodles.google/", "_blank");
});

apps.addEventListener("click", () => {
  const navApps = document.querySelector(".nav-apps");
  if (navApps.style.display === "flex") {
    navApps.style.display = "none";
  } else {
    navApps.style.display = "flex";
  }
});
allSearch.addEventListener("click", () => {
  imageOutput.style.display = "none";
  outputArea.style.display = "flex";
  fetchContent(savedQuery, 1);
});

document.querySelector("#micInput").addEventListener('click', () => {
  let speech = true;
  window.SpeechRecognition = window.webkitSpeechRecognition;

  const recognition = new SpeechRecognition();
  recognition.interimResults = true;

  recognition.addEventListener('result', e => {
    const transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('');

    document.getElementById("searchInput").value = transcript;
    console.log(transcript);
  });

  if (speech == true) {
    recognition.start();
  }
});

imageSection.addEventListener("click", () => {
  outputArea.style.display = "none";
  imageOutput.style.display = "flex"; 
  imageOutput.innerHTML = ""; // Clear previous image results
  fetch(`https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${savedQuery}&start=8&searchType=image`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Unable to reach the website. Status code: " + response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log(data.items);
      displayImages(data.items);
    })
    .catch(error => {
      console.error("Error: Not able to send Request", error.message);
    });
});

let displayImages = (items) =>{
  items.forEach(element=>{
    imageOutput.innerHTML += `
    <div class="output-image-element">
      <img src="${element.link}" alt="${element.title}" class="output-image">
      <h4 class="output-image-heading">${element.htmlSnippet}</h1>
      <a href="${element.link}" target="_blank" class="output-image-title">${element.title}</a>
    </div>`
    
  })
}