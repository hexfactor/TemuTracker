// Add a tracking indicator
document.body.innerHTML += `<button id="trackOverlay" style="position: fixed; width: auto; height: auto; left: 12px; bottom: 0px; z-index: 2; cursor: pointer; background-color: #fb7701; color:white; font-weight: 300; align-items:center; font-size:10px; border-bottom-left-radius: 0; border-bottom-right-radius: 0; border-top-right-radius: 6px; border-top-left-radius: 6px; padding-bottom: 3px; padding-top: 2px; padding-left: 8px; padding-right: 8px; border-width: 0px;" onclick="this.style.display = 'none';">Tracking prices</button>`;

// Load existing stats using the storage API.
let gettingStoredStats = browser.storage.local.get();

// Create a new Date object with the current date.
let currentDate = new Date().setHours(0, 0, 0, 0);


// PID extraction from alternate URL

// Get the link element by its 'rel' attribute and 'hreflang' attribute
var linkElement = document.querySelector('link[rel="alternate"][hreflang="en"]');
// Check if the element exists
if (linkElement) {
  // Extract the 'href' attribute value
  var hrefValue = linkElement.getAttribute('href');
  console.log(hrefValue); // This will log the extracted URL to the console
  // Use regular expression to extract the numeric part
  var numericPart = hrefValue.match(/\d{10,}(?=.html)/); // (Searches for 10+ consecutive digits followed by ".html")
  // Check if a numeric part was found
  if (numericPart) {
    // Convert it to a string
    var numericString = numericPart[0];
    console.log("PID extracted successfully: " + numericString); // This will log the extracted numeric string to the console
  } else {
    console.log("PID not found in the URL.");
  };
} else {
  console.log("URL containing PID not found.");
}

// Get the current item info
let priceExist = document.querySelector("._3cZnvUvE").innerText.replace(/AU\$|\s/g, "");
let itemExist = document.querySelector("._2rn4tqXP").innerText;
console.log("Date: " + new Date().toLocaleDateString() + "\n" + "Price: " + priceExist + "\n" + "Item: " + itemExist + "\n" + "PID: " + numericString + "\n" + "URL: " + window.location.href);

browser.storage.local.get("pages").then((data) => {
  // Check if there is any data stored
  if (data.pages) {
    // Loop through the stored pages
    for (let page of data.pages) {
      // Compate the ID and date with the current ones
      if (page.pid === numericString && page.date === currentDate && page.price === priceExist) {
        // If they match, do not run and instead just exit.
        console.log("Today's price has already been recorded.");
        return;
      }
    }
  }

  // Add the current URL and date to the stored data
  let newPage = { pid: numericString, date: currentDate, name: itemExist, price: priceExist };
  if (data.pages) {
    // If there is existing data, append the new page to it
    data.pages.push(newPage);
  } else {
    // If there is no existing data, create a new array with the new page
    data.pages = [newPage];
  }

  // Save the updated data to browser.storage.local
  browser.storage.local.set(data).then(() => {
    console.log("The page data has been saved.");
  });
});

// Listen for messages from popup.js requesting the HTML content of the current tab
browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getHTML") {
    // Send a response containing the HTML content
    sendResponse({ success: true, item: numericString });
    console.log("Connected to extension popup.");
  }
});