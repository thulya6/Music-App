const themeToggleButton = document.getElementById("theme-toggle");
const body = document.body;
const audio = document.getElementById("audio");
const songTitle = document.getElementById("song-title");
const songList = document.getElementById("song-list");
const navItems = document.querySelectorAll(".nav-item");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const menuToggleButton = document.getElementById("menu-toggle");
const navbar = document.getElementById("navbar");
const overlay = document.getElementById("overlay");
const playerSection = document.querySelector(".player");
const themeButton = document.getElementById("theme-toggle");
const favoritesNavItem = document.getElementById("favorites");
// References to the elements
const searchBar = document.getElementById("searchbar");
const recommendations = document.getElementById("recommendations");
const allSongs = Array.from(songList.children);
const filteredList = document.getElementById("filteredList");

// Function to update recommendations
searchBar.addEventListener("input", () => {
    const searchText = searchBar.value.toLowerCase().trim(); 
    recommendations.innerHTML = ""; // Clear previous recommendations

    // If there is input text, find matching songs
    if (searchText) {
        const matches = allSongs.filter(song => 
            song.textContent.toLowerCase().includes(searchText)
        );

        if (matches.length > 0) {
            recommendations.style.display = "block"; // Show recommendations dropdown
            matches.forEach(song => {
                const recommendation = document.createElement("div");
                recommendation.textContent = song.textContent;
                recommendation.addEventListener("click", () => {
                    searchBar.value = song.textContent; // Set clicked song as input
                    recommendations.style.display = "none"; // Hide recommendations
                    updateFilteredList(searchText);
                });
                recommendations.appendChild(recommendation);
            });
        } else {
            recommendations.style.display = "none"; // Hide dropdown if no matches
        }
    } else {
        recommendations.style.display = "none"; // Hide dropdown if search text is empty
    }
});

// Function to update filtered songs on Enter key press
function updateFilteredList(searchText) {
  filteredList.innerHTML = ""; // Clear previous filtered songs

  // Find matching songs
  const matches = allSongs.filter(song =>
    song.textContent.toLowerCase().includes(searchText)
  );

  // Update the filtered list
  if (matches.length > 0) {
    matches.forEach(song => {
      const listItem = document.createElement("li");
      listItem.textContent = song.textContent;

      // Add event listener to play the song when clicked
      listItem.addEventListener("click", () => {
        const songIndex = songs.findIndex(s => s.title === song.textContent);
        if (songIndex !== -1) {
          currentIndex = songIndex;
          loadSong(currentIndex);
          playSong();
        }
      });

      filteredList.appendChild(listItem);
    });
  } else {
    const noMatch = document.createElement("li");
    noMatch.textContent = "No songs found.";
    filteredList.appendChild(noMatch);
  }

  recommendations.style.display = "none"; // Hide recommendations
}
searchBar.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent form submission or default behavior
    const searchText = searchBar.value.toLowerCase().trim(); // Get input and remove extra spaces
    songList.innerHTML = ""; // Clear the current playlist

    if (searchText === "") {
      // If search bar is cleared, show all songs
      songs.forEach(song => {
        const songItem = document.createElement("li");
        songItem.textContent = song.title;
        songItem.style.cursor = "pointer";

        // Add heart icon for favorites
        createHeartIcon(songItem, song.title);

        // Handle clicking a song
        songItem.addEventListener("click", () => {
          const songIndex = songs.findIndex(s => s.title === song.title);
          if (songIndex !== -1) {
            currentIndex = songIndex;
            loadSong(currentIndex);
            playSong();
          }
        });

        songList.appendChild(songItem);
      });
    }
    else{
    // Filter matching songs
    const filteredSongs = songs.filter(song =>
      song.title.toLowerCase().includes(searchText)
    );

    
    // Update the playlist with the filtered songs
    if (filteredSongs.length > 0) {
      filteredSongs.forEach(song => {
        const songItem = document.createElement("li");
        songItem.textContent = song.title;
        songItem.style.cursor = "pointer";

        // Add heart icon for favorites
        createHeartIcon(songItem, song.title);

        // Handle clicking a song
        songItem.addEventListener("click", () => {
          const songIndex = songs.findIndex(s => s.title === song.title);
          if (songIndex !== -1) {
            currentIndex = songIndex;
            loadSong(currentIndex);
            playSong();
          }
        });

        songList.appendChild(songItem);
      });
      recommendations.innerHTML = "";
    } else {
      recommendations.innerText = "no match found";
    }
  }
}
});






let songs = Array.from(songList.children).map((song) => ({
  title: song.textContent,
  src: song.getAttribute("data-src"),
  language: song.getAttribute("data-language"),
}));
let currentIndex = 0;
let favoriteSongs = []; // Array to hold favorite songs
let currentFilter = "all"; // Variable to track current filter (e.g., "all", "hindi", "telugu", "english", "favorites")
applyFilter();






// Function to create heart icon for each song
function createHeartIcon(songElement, songTitle) {
  const heartIcon = document.createElement("span");
  heartIcon.classList.add("heart");
  heartIcon.style.cssText = 'cursor: pointer; margin-left: auto;'; // Position heart at the end of the song row
  heartIcon.textContent = favoriteSongs.includes(songTitle) ? "💜" : "♡"; // Set initial state based on whether it's a favorite
  
  songElement.appendChild(heartIcon);

  // Handle heart click
  heartIcon.addEventListener("click", () => {
    if (favoriteSongs.includes(songTitle)) {
      // Remove from favorites
      favoriteSongs = favoriteSongs.filter((song) => song !== songTitle);
      heartIcon.textContent = "♡"; // Change to unfilled heart outline
      let cat = songTitle.getAttribute("data-language").split(" ");
      cat.pop();
      songTitle.setAttribute("data-language",cat.join(" "));
      // applyFilter();
    } else {
      // Add to favorites
      favoriteSongs.push(songTitle);
      heartIcon.textContent = "💜"; 
      songTitle.setAttribute("data-language","favorite");
      // applyFilter();
    }
    applyFilter();
    console.log("Favorite songs:", favoriteSongs); // For testing in the console
    updateFavoritesNav(); // Update the favorites list in the nav
  });
}

// Update the favorites in the navigation (favorites section in the navbar)
function updateFavoritesNav() {
  // Update the favorites nav item text
  favoritesNavItem.textContent = `Favorites (${favoriteSongs.length})`;
  updateFavoritesList();
}

// Show the favorites list in the nav only if there are any favorite songs
let favoritesList = document.getElementsByClassName("heart");
  favoritesNavItem.addEventListener("click", () => {
  if (favoritesList.style.display === "none" || favoritesList.style.display === "") {
    updateFavoritesList(); // Populate the favorites list
    favoritesList.style.display = "block"; // Show the list
  } else {
    favoritesList.style.display = "none"; // Hide the list
  }
});

function updateFavoritesList() {
  favoritesList.innerHTML = ""; // Clear the current list

  if (favoriteSongs.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent = "No favorite songs yet.";
    favoritesList.appendChild(emptyMessage);
    return;
  }

  // document.getElementById('favo').innerHTML = "";

  favoriteSongs.forEach((songTitle) => {
    const favoriteItem = document.createElement("li");
    favoriteItem.setAttribute('data-language','favorite');
    favoriteItem.textContent = songTitle;
    favoriteItem.style.cursor = "pointer";
    // Handle clicking a favorite song
    favoriteItem.addEventListener("click", () => {
      const songIndex = songs.findIndex((song) => song.title === songTitle);
      if (songIndex !== -1) {
        currentIndex = songIndex;
        loadSong(currentIndex);
        playSong();
      }
    });
    // favoriteSongs.forEach
    // document.getElementById('favo').innerHTML=favoriteSongs;

    // favoritesList.appendChild(favoriteItem);
    
  });
}
// Menu Toggle
menuToggleButton.addEventListener("click", () => {
  navbar.classList.toggle("open");
  body.classList.toggle("menu-open");
  overlay.style.display = navbar.classList.contains("open") ? "block" : "none";
  playerSection.classList.toggle("dimmed", navbar.classList.contains("open"));
  themeButton.classList.toggle("dimmed", navbar.classList.contains("open"));
});

// Close navbar when overlay is clicked
overlay.addEventListener("click", () => {
  navbar.classList.remove("open");
  body.classList.remove("menu-open");
  overlay.style.display = "none";
  playerSection.classList.remove("dimmed");
  themeButton.classList.remove("dimmed");
});

// Close navbar when a nav item is clicked
navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navbar.classList.remove("open");
    body.classList.remove("menu-open");
    overlay.style.display = "none";
    playerSection.classList.remove("dimmed");
    themeButton.classList.remove("dimmed");

    // Handle navigation item click
    handleNavItemClick(item);
  });
});

// Handle the navigation when clicking a nav item
function handleNavItemClick(item) {
  const filter = item.getAttribute("data-filter");
  currentFilter = filter; // Update the current filter

  console.log(currentFilter)

  applyFilter();
}

// Apply the current filter (e.g., "all", "hindi", "telugu", "favorites")
function applyFilter() {
  songList.innerHTML = ""; // Clear the current song list

  let filteredSongs = [];

  // if (currentFilter === "favorite") {
  //   filteredSongs = songs.filter(song => song.language === currentFilter); // Show only favorite songs}
  if (currentFilter === "all") {
    filteredSongs = songs; // Show all songs
  } else {
    filteredSongs = songs.filter(song => song.language === currentFilter); // Show songs for the selected language filter
  }

  // Display filtered songs with heart icon
  filteredSongs.forEach((song) => {
    const songItem = document.createElement("li");
    songItem.textContent = song.title;
    songItem.style.cursor = "pointer";
    
    // createHeartIcon(songItem, song.title); // Add heart icon next to song title
    createHeartIcon(songItem,song.title);
    // Handle clicking a song
    songItem.addEventListener("click", () => {
      const songIndex = songs.findIndex((s) => s.title === songItem.textContent);
      if (songIndex !== -1) {
        currentIndex = songIndex;
        loadSong(currentIndex);
        playSong();
      }
    });

    songList.appendChild(songItem);
  });

  // Reset to first song if there are filtered results
  if (filteredSongs.length > 0) {
    loadSong(0);
    playSong();
  }
}

// Load song
function loadSong(index) {
  const song = songs[index];
  songTitle.textContent = song.title;
  audio.src = song.src;
}

// Play song
function playSong() {
  audio.play();
  playBtn.textContent = "Pause";
}

// Pause song
function pauseSong() {
  audio.pause();
  playBtn.textContent = "Play";
}

// Toggle play/pause
playBtn.addEventListener("click", () => {
  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
});

// Next song
nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  playSong();
});

// Previous song
prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  playSong();
});

// Auto-play next song when the current song ends
audio.addEventListener("ended", () => {
  nextBtn.click();
});

// Update song name on song selection
songList.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    const selectedSong = e.target.textContent;
    songTitle.textContent = selectedSong;
  }
});

// Initial song loading for all songs
applyFilter(); // Initially load all songs

// Event listener for the theme toggle button
themeToggleButton.addEventListener("click", () => {
  // Toggle the 'light-theme' class on the body element
  body.classList.toggle("light-theme");

  // Toggle button icon (optional)
  if (body.classList.contains("light-theme")) {
    themeToggleButton.textContent = "🌞"; // Sun icon for light theme
  } else {
    themeToggleButton.textContent = "🌙"; // Moon icon for dark theme
  }
});
// localStorage.setItem('theme',body.classList.contains('light-theme')?'light':'dark');

// document.querySelector(".playlist").addEventListener("click", function (event) {
//     // Check if the clicked element is the heart icon
//     if (event.target.classList.contains("heart")) {
//         const clickedLi = event.target.closest("li"); // Get the parent <li> of the clicked <span>
//         if (clickedLi) {
//             const songTitle = clickedLi.textContent.trim();
//             clickedLi.setAttribute('data-language','favorite');
//         }
//     }
// });
