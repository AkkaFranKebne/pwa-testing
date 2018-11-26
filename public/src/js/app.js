if (!window.Promise) {
  window.Promise = Promise; // from promise.js polyfill
}
// turns on service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js') // returns a promise
    .then(function() {
      // what if promise resolved
      console.info('Service Worker registered');
    })
    .catch(function(error) {
      // what if promise rejected
      console.info('Service Worker not registered', error);
    });
}

var defferedPrompt;

window.addEventListener('beforeinstallprompt', function(event) {
  event.preventDefault(); // do not show the prompt add to homepage by default config
  defferedPrompt = event; // pass this event to this variable
  return false;
});

//////// examples //////////////
//handmade promise example
// var promise = new Promise(function(resolve, reject) {
//   setTimeout(function() {
//     resolve('This is resolved');
//     // reject({code: 500, message: 'Error 500'});
//   }, 3000);
// });

// promise;
// if resolved
// .then(function(result) {
//   return result;
// })
// .then(function(result2) {
//   console.log(result2);
// })
// // if rejected
// .catch(function(error) {
//   console.log(error);
// });

// fetch example (fetch expects promise, no need to use handmade promise) - asynchronous code
// get
// fetch('https://httpbin.org/ip')
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(jsonData) {
//     console.log(jsonData);
//   })
//   .catch(function(error) {
//     console.log(error);
//   });

// how it would be done in the old way - synchronous code, cannot be use in sw
// var xhr = new XMLHttpRequest();
// xhr.open('GET', 'https://httpbin.org/ip');
// xhr.responseType = 'json';
// xhr.onload = function() {
//   console.log(xhr.response);
// };
// xhr.onerror = function() {
//   console.log('Error');
// };
// xhr.send();

// post
// fetch('https://httpbin.org/post', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     Accept: 'application/json'
//   },
//   body: JSON.stringify({ message: 'This message was posted' })
//   // mode: 'no-cors' //no cross origin
// })
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(jsonData) {
//     console.log(jsonData);
//   })
//   .catch(function(error) {
//     console.log(error);
//   });

// assignment

// var button = document.querySelector('.enable-notifications');
// console.log('button', button);
// var output = document.querySelector('.mdl-navigation__link');
// console.log('output', output);
// button.addEventListener('click', function() {
//   var promiseOnClick = new Promise(function(resolve) {
//     console.log('promise on click started');
//     setTimeout(function() {
//       resolve('https://swapi.co/api/people/1');
//     }, 3000);
//   })
//     .then(function(resolvedUrl) {
//       fetch(resolvedUrl);
//     })
//     .then(function(response) {
//       return response.json();
//     })
//     .then(function(data) {
//       output.textContent = data.name;
//     });
// });
// button.addEventListener('click', function() {
//   var promiseOnClick2 = new Promise(function(resolve) {
//     console.log('promise on click started');
//     setTimeout(function() {
//       resolve('https://httpbin.org/post');
//     }, 3000);
//   })
//     .then(function(resolvedUrl) {
//       fetch(resolvedUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Accept: 'application/json'
//         },
//         body: JSON.stringify({ message: 'This message was posted' })
//       });
//     })
//     .then(function(response) {
//       return response.json();
//     })
//     .then(function(data) {
//       console.log(data.message);
//     });
// });
