document.addEventListener("DOMContentLoaded", () => {
    const accessKey = 'nvP7eFLT5D4gp05nA-BhZsba83SY8xPjJHcrBlii9zY';
    const imagesContainer = document.querySelector('.images-container');
    const searchInput = document.querySelector('.search-input');
    const search_btn = document.querySelector('.material-symbols-outlined');
    const loadMoreBtn = document.querySelector('.loadMoreBtn');

    let page = 1;
    let isRandom = true;
    let currentQuery = ""; // Store the last search query

    const fetchImages = async (query, pageNo, random = false) => {
        if (pageNo === 1) {
            imagesContainer.innerHTML = '';
        }

        let url;
        if (random) {
            url = `https://api.unsplash.com/photos/random?count=30&client_id=${accessKey}`;
        } else {
            url = `https://api.unsplash.com/search/photos/?query=${query}&per_page=30&page=${pageNo}&client_id=${accessKey}`;
        }

        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);

            let results = random ? data : data.results;

            if (!results || results.length === 0) {
                imagesContainer.innerHTML = `<h2>No images found. Try another search.</h2>`;
                loadMoreBtn.style.display = "none";
                return;
            }

            results.forEach(photo => {
                const imageElement = document.createElement('div');
                imageElement.classList.add('imageDiv');
                imageElement.innerHTML = `<img src="${photo.urls.regular}">`;

                const overlayElement = document.createElement('div');
                overlayElement.classList.add('overlay');

                const overlayText = document.createElement('h3');
                overlayText.innerText = photo.alt_description || "No Description";

                overlayElement.appendChild(overlayText);
                imageElement.appendChild(overlayElement);
                imagesContainer.appendChild(imageElement);
            });

            // Show Load More button only for searched queries (not for random images)
            if (!random && data.total_pages > pageNo) {
                loadMoreBtn.style.display = "block";
            } else {
                loadMoreBtn.style.display = "none";
            }

        } catch (error) {
            console.error("Error fetching images:", error);
            imagesContainer.innerHTML = `<h2>Failed to fetch images. Please try again.</h2>`;
            loadMoreBtn.style.display = "none";
        }
    };

    // Load random images on page load
    fetchImages("", 1, true);

    search_btn.addEventListener('click', (e) => {
        e.preventDefault();
        const inputText = searchInput.value.trim();
        if (inputText !== '') {
            isRandom = false;
            currentQuery = inputText; // Store query
            page = 1;
            fetchImages(currentQuery, page, false);
        } else {
            imagesContainer.innerHTML = `<h2>Please enter a search query</h2>`;
            loadMoreBtn.style.display = "none";
        }
    });

    loadMoreBtn.addEventListener('click', () => {
        if (!isRandom) {
            page++;
            fetchImages(currentQuery, page, false);
        }
    });
});
