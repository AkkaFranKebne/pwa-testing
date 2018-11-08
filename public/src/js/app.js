if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function() {
    console.info('Service Worker registered');
  });
}

var defferedPrompt;

window.addEventListener('beforeinstallprompt', function(event) {
  event.preventDefault(); // do not show the prompt add to homepage by default config
  defferedPrompt = event; // pass this event to this variable
  return false;
});
