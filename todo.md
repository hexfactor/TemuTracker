# Todo List

_Look for `(FIX)` within code_

## Short-term

### Manifest.json

- [ ] Change the extension activation into a page_action.
- [ ] Add permission for unlimited client side storage

### Popup.js

- [ ] Get rid of the TypeError caused when opening the extension window on unsupported sites. At the moment, the extension popup sends an API call to the extension's `background.js` script. Ideally check for site compatability before calling the script.
- [ ] Consider a more efficient search method for when there are many saved entries.

### Background.js

- [ ] Check for the model of an item before adding the price to prevent multiple prices from being recorded under a single product.
- [ ] Clean up variable names.
- [ ] Fix the price-saving function to be more compatible with all currencies: `let priceExist = document.querySelector("._3cZnvUvE").innerText.replace(/AU\$|\s/g, "");`. This may also involve implementing a script to tidy up any previous mis-saved prices.
- [ ] Organise code into functions for better tidiness and referencability

## Long-term

- [ ] Add a price history graph to the popup.
- [ ] Add the ability to read the prices of items in the cart and in search results.
- [ ] Add wishlist functionality
  - [ ] "Wishlist" dropdown (with checkboxes) on product pages next to "Add to Cart"
  - [ ] Separate JSON item for wishlists and their contents
  - [ ] Webpage for viewing wishlists
- [ ] Settings page
  - [ ] Export/Import saved prices as CSV or JSON to backup
  - [ ] Clear saved prices and wishlists