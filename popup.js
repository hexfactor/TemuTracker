// About page overlay
document.addEventListener('DOMContentLoaded', function () {
    var overlay = document.getElementById('overlay');

    overlay.addEventListener('click', function () {
        aboutoff();
    });
});

document.addEventListener('DOMContentLoaded', function () {
    var overlay = document.getElementById('trackOverlay');

    overlay.addEventListener('click', function () {
        abouton();
    });
});

function abouton() {
    document.getElementById('overlay').style.display = "block";
}

function aboutoff() {
    document.getElementById('overlay').style.display = "none";
}

function isNumeric(input) {
    // Regular expression to match only numbers (0-9)
    var numericRegex = /^[0-9]+$/;

    // Check if the input matches the numeric regex
    return numericRegex.test(input);
}

// Get the current tab URL
browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {

    // Get the current URL
    let currentURL = tabs[0].url;

    // Print the current URL
    console.log("URL: " + currentURL);

    // Request the HTML content of the current tab
    browser.tabs.sendMessage(tabs[0].id, { action: "getHTML" }, function (response) {
        // If response is successful, display the HTML content in the popup
        if (response.success) {
            let content = document.getElementById('content');
            let itemID = response.item;
            // Ensure itemID is accessible to the rest of the script
            console.log("ID: " + itemID);
            document.getElementById("content").style.display = "block";
            content.innerHTML = `<p style="margin-top: 0;"><strong>Product ID:</strong> ${itemID}</p>`;

            // Get the stored data from local storage
            browser.storage.local.get('pages', function (data) {
                let pages = data.pages;

                // Find the matching item in the data
                let item = pages.find(page => page.pid === itemID);
                console.log("Searching for " + itemID)

                // If item is found, display its name and price history
                if (item) {
                    let content = document.getElementById('content');
                    let tableHTML = `<p><strong>Name:</strong> ${item.name}</p>`;
                    tableHTML += `<p><strong>Current Price:</strong> $${item.price}</p>`;
                    tableHTML += `<table><thead><tr><th>Date</th><th>Price</th></tr></thead><tbody>`;

                    // Loop through the data and build the table rows
                    for (let page of pages) {
                        if (page.pid === itemID) {
                            let date = new Date(page.date).toLocaleDateString();
                            let price = page.price;
                            tableHTML += `<tr><td>${date}</td><td>$${price}</td></tr>`;
                        }
                    }
                    tableHTML += `</tbody></table>`;

                    // Set the entire HTML content at once
                    content.innerHTML += tableHTML;
                }

                // If item is not found, display an error message
                else {
                    let content = document.getElementById('content');
                    content.innerHTML += `<p>Sorry, no price history found for this item.</p>`;
                }
            });
        }
        // If response is unsuccessful, display an error message
        else {
            let content = document.getElementById('content');
            content.innerHTML = `<p>Sorry, no price history found for this item.</p>`;
        }
    });
});



// Get references to the search input and results container
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// Handle input changes in the search input field
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();

    document.getElementById("searchResults").style.display = "block";

    // Get the stored data from local storage
    browser.storage.local.get('pages', function (data) {
        let pages = data.pages;

        // Filter items by name
        let filteredItems = pages.filter(page => page.name.toLowerCase().includes(searchTerm) && (isNumeric(page.pid) || isNumeric(page.item)));

        // Display search results
        displaySearchResults(filteredItems);
    });
});

// Function to display search results
function displaySearchResults(results) {
    let resultHTML = '';

    if (results.length > 0) {
        for (let result of results) {
            resultHTML += `<strong>Name:</strong> ${result.name} (<a href="https://www.temu.com/search_result.html?search_key=${result.pid}" target="_blank">PID: ${result.pid}</a>)<br><strong>Price:</strong> $${result.price} (${new Date(result.date).toLocaleDateString()})<br><br>`;
        }
    } else {
        resultHTML = '<p>No results found.</p>';
    }

    searchResults.innerHTML = resultHTML;
}