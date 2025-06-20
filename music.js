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
  heartIcon.style.cssText = 'cursor: pointer; margin-left: auto;';
  heartIcon.textContent = favoriteSongs.includes(songTitle) ? "💜" : "♡"; 
  
  songElement.appendChild(heartIcon);

  heartIcon.addEventListener("click", () => {
    if (favoriteSongs.includes(songTitle)) {
      favoriteSongs = favoriteSongs.filter((song) => song !== songTitle);
      heartIcon.textContent = "♡"; 
      let cat = songTitle.getAttribute("data-language").split(" ");
      cat.pop();
      songTitle.setAttribute("data-language",cat.join(" "));
    } else {
      favoriteSongs.push(songTitle);
      heartIcon.textContent = "💜"; 
      songTitle.setAttribute("data-language","favorite");
    }
    applyFilter();
    console.log("Favorite songs:", favoriteSongs); 
    updateFavoritesNav(); 
  });
}

function updateFavoritesNav() {
  favoritesNavItem.textContent = `Favorites (${favoriteSongs.length})`;
  updateFavoritesList();
}
let favoritesList = document.getElementsByClassName("heart");
  favoritesNavItem.addEventListener("click", () => {
  if (favoritesList.style.display === "none" || favoritesList.style.display === "") {
    updateFavoritesList(); 
    favoritesList.style.display = "block"; 
  } else {
    favoritesList.style.display = "none"; 
  }
});

function updateFavoritesList() {
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
    // favoriteSongs.forEach
    // document.getElementById('favo').innerHTML=favoriteSongs;

    // favoritesList.appendChild(favoriteItem);
    
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

function applyFilter() {
  songList.innerHTML = "";

  let filteredSongs = [];

  // if (currentFilter === "favorite") {
  //   filteredSongs = songs.filter(song => song.language === currentFilter); }
  if (currentFilter === "all") {
    filteredSongs = songs; 
  } else {
    filteredSongs = songs.filter(song => song.language === currentFilter);
  }
  filteredSongs.forEach((song) => {
    const songItem = document.createElement("li");
    songItem.textContent = song.title;
    songItem.style.cursor = "pointer";
    
    // createHeartIcon(songItem, song.title); 
    createHeartIcon(songItem,song.title);
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

  if (filteredSongs.length > 0) {
    loadSong(0);
    playSong();
  }
}

function loadSong(index) {
  const song = songs[index];
  songTitle.textContent = song.title;
  audio.src = song.src;
}

function playSong() {
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

applyFilter(); 
themeToggleButton.addEventListener("click", () => {
  body.classList.toggle("light-theme");

  if (body.classList.contains("light-theme")) {
    themeToggleButton.textContent = "🌞"; 
  } else {
    themeToggleButton.textContent = "🌙";
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
