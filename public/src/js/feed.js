var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');

function openCreatePostModal() {
  createPostArea.style.display = 'block';
  if (defferedPrompt) {
    // if add to homepage prompt can be shown
    defferedPrompt.prompt(); // show it here
    defferedPrompt.userChoice.then(function(result) {
      console.log(result);
      if (result.outcome === 'dismissed') {
        console.log('nope');
      } else {
        console.log('yep');
      }
    });
    defferedPrompt = null; // can be prompt only once
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);
