'use strict';

import './popup.css';
const AMAZON_DOMAIN = 'amazon.com';
const AMAZON_PRODUCT = 'amazon.ca/gp/product/';
const AMAZON_CART = 'amazon.com/gp/cart/view.html?ref_=nav_cart';

chrome.tabs.getSelected(null, function(tab) {
    if (tab.url.includes('amazon.com')) {
      if (tab.url.includes(AMAZON_PRODUCT)) {
        // TODO: Handle duplicates?
        tab.do
        var product = createAmazonProduct();

      }
      // EAMAZON CART: If empty cart or user is not viewing the cart webpage
      else if (tab.url.includes('amazon.com/gp/cart/view.html?ref_=nav_cart')) {
        var itemsList = document.querySelector('.sc-list-item-content');
        if (itemsList != null) {
          document.querySelector('.analytics_cont').classList.add('hidden');
          document.getElementById('emptyCart').setAttribute('hidden', '');
          // document.querySelector('.shopping-list').classList.remove('hidden');
          // TODO: MATCH CART TO PRODS VIEWED
        }
      } else {
        document.getElementById('emptyCart').removeAttribute('hidden');
      }
    }
});
function createAmazonProduct(id, title, description) {
  console.log(`Creating Amazon Product: '${title}' - in popup.js`)
  var amazonProduct = {
    id: id,
    title: title,
    description: description
  };

  return amazonProduct;
}

(function() {
  // We will make use of Storage API to get and store `count` value
  // More information on Storage API can we found at
  // https://developer.chrome.com/extensions/storage

  // To get storage access, we have to mention it in `permissions` property of manifest.json file
  // More information on Permissions can we found at
  // https://developer.chrome.com/extensions/declare_permissions
  // getters and setters for storage

  // const productStorage = {
  //   get: cb => {
  //     chrome.storage.sync.get(['prducts_viewed'], result => {
  //       cb(result.products_viewed);
  //     });
  //   },
  //   set: (key, value, cb) => {
  //     chrome.storage.sync.set(
  //       {
  //         products_viewed: value,
  //       },
  //       () => {
  //         cb();
  //       }
  //     );
  //   },
  //   add: (value) => {
  //     chrome.storage.sync.ad
  //   }
  // };

  function setupItemsCart(initialItems = []) {
    setupItemsDisplay(initialItems);
    for (var i = 0; i < itemsList.length; i++) {
    itemsList[i].addEventListener('click', function(event) {
        if (!confirm("sure u want to delete " + this.title)) {
            event.preventDefault();
        }
    });
}
    document.getElementById('incrementBtn').addEventListener('click', () => {
      updateCounter({
        type: 'INCREMENT',
      });
    });

    document.getElementById('decrementBtn').addEventListener('click', () => {
      updateCounter({
        type: 'DECREMENT',
      });
    });
  }

  function setupItemsDisplay() {

  }

  function updateCounter({ type }) {
    counterStorage.get(count => {
      let newCount;

      if (type === 'INCREMENT') {
        newCount = count + 1;
      } else if (type === 'DECREMENT') {
        newCount = count - 1;
      } else {
        newCount = count;
      }

      counterStorage.set(newCount, () => {
        document.getElementById('counter').innerHTML = newCount;

        // Communicate with content script of
        // active tab by sending a message
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          const tab = tabs[0];

          chrome.tabs.sendMessage(
            tab.id,
            {
              type: 'COUNT',
              payload: {
                count: newCount,
              },
            },
            response => {
              console.log('Current count value passed to contentScript file');
            }
          );
        });
      });
    });
  }

  function restoreCounter() {
    // Restore count value
    counterStorage.get(count => {
      if (typeof count === 'undefined') {
        // Set counter value as 0
        counterStorage.set(0, () => {
          setupCounter(0);
        });
      } else {
        setupCounter(count);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', restoreCounter);

  // Communicate with background file by sending a message
  chrome.runtime.sendMessage(
    {
      type: 'GREETINGS',
      payload: {
        message: 'Hello, my name is Pop. I am from Popup.',
      },
    },
    response => {
      console.log(response.message);
    }
  );
})();
