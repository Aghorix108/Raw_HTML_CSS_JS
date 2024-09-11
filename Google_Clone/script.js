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
let apiKey = 'AIzaSyAo5IUZzG3jLpe0QiAVIzfn1EhF8muBR2o';
let searchEngineId = 'c5352ca746dff43a7';
let start = 1; // Initialize start value
let savedQuery = ""; // Initialize a variable to store the query globally
let totalResults = 100; // Assuming 100 total results for pagination

output.style.display = "none";
paginationSection.style.display = "none";
// Function to fetch search content
let fetchContent = (query, pageNum = 1, searchType) => { 
  if (query) {
    savedQuery = query.value.trim(); // Save the query for later use
  }

  if (!savedQuery) {
    alert("Please enter a search term.");
    return;
  }

  let baseLink = 'https://www.googleapis.com/customsearch/v1?'
  let q = encodeURIComponent(savedQuery);
  let start = pageNum;
  let url = `${baseLink}key=${apiKey}&cx=${searchEngineId}&q=${q}&start=${start}&serachType=${searchType}`;

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
      createPaginationButtons(pageNum); // Create page numbers dynamically
    })
    .catch(error => {
      console.error("Error: Not able to send Request", error.message);
    });
};

// Function to display search results
let displayContent = (items) => {
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

// Function to create pagination buttons (1 to 10)
let createPaginationButtons = (currentPage) => {
  pages.innerHTML = ""; // Clear previous pagination buttons
  let totalPages = Math.min(10, Math.ceil(totalResults / 10)); // Limit to 10 pages for demo purposes

  for (let i = 1; i <= totalPages; i++) {
    let button = document.createElement("a");
    button.className = "pagination-btn";
    button.innerText = i;

    // Add 'active' class to the current page button
    if (i === currentPage) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      let newStart = (i - 1) * 10 + 1;

      // Remove 'active' class from all pagination buttons
      let allButtons = document.querySelectorAll(".pagination-btn");
      allButtons.forEach(btn => btn.classList.remove("active"));

      // Add 'active' class to the clicked button
      button.classList.add("active");

      // Fetch content for the selected page
      fetchContent(null, newStart);
    });

    pages.appendChild(button);
  }
};


// Next and Previous page event listeners
nextPage.addEventListener("click", () => {
  start += 10;
  window.scrollTo(0, 0);
  fetchContent(null, start);
});

prevPage.addEventListener("click", ()=> {
  start -= 10;
  if (start < 1) start = 1; // Prevent start from going below 1
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
