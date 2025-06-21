const CLIENT_ID = "cf8d2869";
const SEARCH_URL = "https://api.jamendo.com/v3.0/tracks/";

async function fetchSongsByGenre(genre) {
  try {
    const response = await fetch(
      `${SEARCH_URL}?client_id=${CLIENT_ID}&format=json&tags=${genre}&limit=20`
    );

    const data = await response.json();
    return data.results.map(track => ({
      title: track.name,
      src: track.audio, 
      language: genre,  
    }));
  } catch (error) {
    console.error("Error fetching songs from Jamendo:", error);
    return [];
  }
}

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
const searchBar = document.getElementById("searchbar");
const recommendations = document.getElementById("recommendations");
const allSongs = Array.from(songList.children);
const filteredList = document.getElementById("filteredList");
searchBar.addEventListener("input", () => {
    const searchText = searchBar.value.toLowerCase().trim(); 
    recommendations.innerHTML = ""; 
    if (searchText) {
        const matches = allSongs.filter(song => 
            song.textContent.toLowerCase().includes(searchText)
        );

        if (matches.length > 0) {
            recommendations.style.display = "block"; 
            matches.forEach(song => {
                const recommendation = document.createElement("div");
                recommendation.textContent = song.textContent;
                recommendation.addEventListener("click", () => {
                    searchBar.value = song.textContent; 
                    recommendations.style.display = "none"; 
                    updateFilteredList(searchText);
                });
                recommendations.appendChild(recommendation);
            });
        } else {
            recommendations.style.display = "none"; 
        }
    } else {
        recommendations.style.display = "none"; 
    }
});

function updateFilteredList(searchText) {
  filteredList.innerHTML = ""; 
  const matches = allSongs.filter(song =>
    song.textContent.toLowerCase().includes(searchText)
  );
  if (matches.length > 0) {
    matches.forEach(song => {
      const listItem = document.createElement("li");
      listItem.textContent = song.textContent;
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

  recommendations.style.display = "none"; 
}
searchBar.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const searchText = searchBar.value.toLowerCase().trim(); 
    songList.innerHTML = ""; 

    if (searchText === "") {
      songs.forEach(song => {
        const songItem = document.createElement("li");
        songItem.textContent = song.title;
        songItem.style.cursor = "pointer";
        createHeartIcon(songItem, song.title);
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
    const filteredSongs = songs.filter(song =>
      song.title.toLowerCase().includes(searchText)
    );
    if (filteredSongs.length > 0) {
      filteredSongs.forEach(song => {
        const songItem = document.createElement("li");
        songItem.textContent = song.title;
        songItem.style.cursor = "pointer";
        createHeartIcon(songItem, song.title);
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
let favoriteSongs = []; 
let currentFilter = "all"; 
applyFilter();

function createHeartIcon(songElement, songTitle) {
  const heartIcon = document.createElement("span");
  heartIcon.classList.add("heart");
  heartIcon.style.cssText = "cursor: pointer; margin-left: auto;";
  heartIcon.textContent = favoriteSongs.includes(songTitle) ? "💜" : "♡";
  
  songElement.appendChild(heartIcon);
  heartIcon.addEventListener("click", () => {
    if (favoriteSongs.includes(songTitle)) {
      favoriteSongs = favoriteSongs.filter(song => song !== songTitle);
      heartIcon.textContent = "♡";
    } else {
      favoriteSongs.push(songTitle);
      heartIcon.textContent = "💜"; 
    }

    console.log("Favorite songs:", favoriteSongs); 
    updateFavoritesNav(); 
  });
}

function initializeHeartIcons() {
  songList.querySelectorAll("li").forEach(songElement => {
    const songTitle = songElement.textContent.trim();

    if (!songElement.querySelector(".heart")) {
      createHeartIcon(songElement, songTitle);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeHeartIcons();
  applyFilter(); 
});
function updateFavoritesNav() {
  favoritesNavItem.textContent = `Favorites (${favoriteSongs.length})`;

  const favoritesDropdown = document.getElementById("favorites-list");
  favoritesDropdown.innerHTML = ""; 

  if (favoriteSongs.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent = "No favorite songs yet.";
    favoritesDropdown.appendChild(emptyMessage);
    return;
  }

  favoriteSongs.forEach(songTitle => {
    const favoriteItem = document.createElement("li");
    favoriteItem.textContent = songTitle;
    favoriteItem.style.cursor = "pointer";

    favoriteItem.addEventListener("click", () => {
      const songIndex = songs.findIndex(song => song.title === songTitle);
      if (songIndex !== -1) {
        currentIndex = songIndex;
        loadSong(currentIndex);
        playSong();
      }
    });

    favoritesDropdown.appendChild(favoriteItem);
  });
}

favoritesNavItem.addEventListener("click", () => {
  const favoritesList = document.getElementById("favorites-list");
  favoritesList.style.display =
    favoritesList.style.display === "block" ? "none" : "block";
});


function updateFavoritesList() {
  const favoritesList = document.getElementById("favorites-list");
  favoritesList.innerHTML = ""; 

  if (favoriteSongs.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent = "No favorite songs yet.";
    favoritesList.appendChild(emptyMessage);
    return;
  }

  favoriteSongs.forEach((songTitle) => {
    const favoriteItem = document.createElement("li");
    favoriteItem.setAttribute('data-language','favorite');
    favoriteItem.textContent = songTitle;
    favoriteItem.style.cursor = "pointer";
    favoriteItem.addEventListener("click", () => {
      const songIndex = songs.findIndex((song) => song.title === songTitle);
      if (songIndex !== -1) {
        currentIndex = songIndex;
        loadSong(currentIndex);
        playSong();
      }
    });
    favoritesList.appendChild(favoriteItem);
  });
}
menuToggleButton.addEventListener("click", () => {
  navbar.classList.toggle("open");
  body.classList.toggle("menu-open");
  overlay.style.display = navbar.classList.contains("open") ? "block" : "none";
  playerSection.classList.toggle("dimmed", navbar.classList.contains("open"));
  themeButton.classList.toggle("dimmed", navbar.classList.contains("open"));
});

overlay.addEventListener("click", () => {
  navbar.classList.remove("open");
  body.classList.remove("menu-open");
  overlay.style.display = "none";
  playerSection.classList.remove("dimmed");
  themeButton.classList.remove("dimmed");
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navbar.classList.remove("open");
    body.classList.remove("menu-open");
    overlay.style.display = "none";
    playerSection.classList.remove("dimmed");
    themeButton.classList.remove("dimmed");

    handleNavItemClick(item);
  });
});

function handleNavItemClick(item) {
  const filter = item.getAttribute("data-filter");
  currentFilter = filter; 

  console.log(currentFilter)

  applyFilter();
}

async function applyFilter() {
  songList.innerHTML = ""; 

  let filteredSongs = [];

  if (currentFilter === "all") {
    const genres = ["hindi", "telugu", "english"];
    const allGenreSongs = await Promise.all(genres.map(fetchSongsByGenre));
    const allApiSongs = allGenreSongs.flat(); 
    const apiUniqueSongs = allApiSongs.filter(
      apiSong => !songs.some(localSong => localSong.title === apiSong.title)
    );
    songs = [...songs, ...apiUniqueSongs]; 
    filteredSongs = songs; 
  } else if (currentFilter === "favorites") {
    filteredSongs = songs.filter(song => favoriteSongs.includes(song.title));
  } else if (["hindi", "telugu", "english"].includes(currentFilter)) {
    const apiSongs = await fetchSongsByGenre(currentFilter); 
    const apiUniqueSongs = apiSongs.filter(
      apiSong => !songs.some(localSong => localSong.title === apiSong.title)
    );
    songs = [...songs, ...apiUniqueSongs]; 
    filteredSongs = songs.filter(song => song.language === currentFilter);
  } else {
    filteredSongs = songs.filter(song => song.language === currentFilter); 
  }
  renderSongs(filteredSongs);
  initializeHeartIcons();
}

function renderSongs(songArray) {
  songArray.forEach(song => {
    const songItem = document.createElement("li");
    songItem.textContent = song.title;
    songItem.style.cursor = "pointer";

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

function loadSong(index) {
  const song = songs[index];
  if (!song || !song.src || song.src === "no preview available") {
    alert("This song cannot be played.");
    return;
  }
  audio.src = song.src;
  songTitle.textContent = song.title;
}

function playSong() {
  audio.pause();
  audio.currentTime = 0;
  audio.play();
  playBtn.textContent = "Pause";
}

function pauseSong() {
  audio.pause();
  playBtn.textContent = "Play";
}

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  playSong();
});

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  playSong();
});

audio.addEventListener("ended", () => {
  nextBtn.click();
});

songList.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    const selectedSong = e.target.textContent;
    songTitle.textContent = selectedSong;
  }
});
document.addEventListener("DOMContentLoaded", () => {
  applyFilter(); 
});

applyFilter(); 

themeToggleButton.addEventListener("click", () => {
  body.classList.toggle("light-theme");

  if (body.classList.contains("light-theme")) {
    themeToggleButton.textContent = "🌞"; 
  } else {
    themeToggleButton.textContent = "🌙"; 
  }
});
