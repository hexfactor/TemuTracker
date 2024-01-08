var errors = 0

// Add a status indicator

function indicate(statusMsg) {
  let trackOverlay = document.getElementById('trackOverlay');
  if (trackOverlay) {
    trackOverlay.textContent = statusMsg;
  } else {
    document.body.innerHTML += `<button id="trackOverlay" style="position: fixed; width: auto; height: auto; left: 12px; bottom: 0px; z-index: 2; cursor: pointer; background-color: #fb7701; color:white; font-weight: 300; align-items:center; font-size:10px; border-bottom-left-radius: 0; border-bottom-right-radius: 0; border-top-right-radius: 6px; border-top-left-radius: 6px; padding-bottom: 3px; padding-top: 2px; padding-left: 8px; padding-right: 8px; border-width: 0px;" onclick="this.style.display = 'none';">` + statusMsg + `</button>`;
  }
};

indicate("Loading... ")

// Create a new Date object with the current date.
let currentDate = new Date().setHours(0, 0, 0, 0); // Merge into references


// === PID extraction from alternate URL ===


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
    errors++
  };
} else {
  console.log("URL containing PID not found.");
  errors++
}


// === Product page info ===


let priceExist, itemExist;
try {
  priceExist = parseFloat(document.querySelector("._3cZnvUvE").innerText.replace(/[^0-9.]/g, "")); // Returns a price value
  itemExist = document.querySelector("._2rn4tqXP").innerText;
  console.log("Date: " + new Date().toLocaleDateString() + "\n" + "Price: " + priceExist + "\n" + "Item: " + itemExist + "\n" + "PID: " + numericString + "\n" + "URL: " + window.location.href);
} catch (error) {
  indicate("Product information not found");
  errors++
}


// === Data storage ===


if (errors==0) {
  console.log('No errors so far, attempting to record prices.')
  browser.storage.local.get("pages").then((data) => {
    indicate('Tracking prices');
    
    // Check if there is any data stored
    if (data.pages) {
      // Loop through the stored pages
      for (let page of data.pages) {
        // Compare the ID and date with the current ones
        if (page.pid === numericString && page.date === currentDate && page.price === priceExist) {
          // If they match, do not run and instead just exit.
          console.log("Today's price has already been recorded.");
          return; // (FIX), don't use return and instead use if... else.
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
} else {
  indicate('Not tracking prices');
  console.log("This is not a product page. Prices were not extracted or recorded.")
};

// Listen for messages from popup.js requesting the HTML content of the current tab
browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getHTML") {
    // Send a response containing the HTML content
    sendResponse({ success: true, item: numericString, name: itemExist });
    console.log("Connected to extension popup.");
  }
});