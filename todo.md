# Todo List

### Short-term

- [ ] Get rid of the TypeError caused when opening the extension window on unsupported sites. At the moment, the extension popup sends an API call to the extension's `background.js` script. Ideally check for site compatability before calling the script.
- [ ] Consider a more efficient search method for when there are many saved entries.
- [ ] Check for the model of an item before adding the price to prevent multiple prices from being recorded under a single product.
- [ ] Clean up variable names.
- [ ] Change the extension activation into a page_action.

### Long-term

- [ ] Add a price history graph to the popup.
- [ ] Add the ability to read the prices of items in the cart and in search results.
