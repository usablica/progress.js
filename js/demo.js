function isElementInViewport(el) {
  var rect = el.getBoundingClientRect();
  
  return (
    rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document. documentElement.clientHeight) && /*or $(window).height() */
    rect.right <= (window.innerWidth || document. documentElement.clientWidth) /*or $(window).width() */
  );
}

function givenElementInViewport (el, fn) {
  return function () {
    if (isElementInViewport(el)) {
      fn.call();
    }
  }
}

function addViewportEvent (el, fn) {
  if (window.addEventListener) {
    addEventListener('DOMContentLoaded', givenElementInViewport(el, fn), false); 
    addEventListener('load', givenElementInViewport(el, fn), false);
    addEventListener('scroll', givenElementInViewport(el, fn), false);
    addEventListener('resize', givenElementInViewport(el, fn), false);
  } else if (window.attachEvent)  {
    attachEvent('DOMContentLoaded', givenElementInViewport(el, fn));
    attachEvent('load', givenElementInViewport(el, fn));
    attachEvent('scroll', givenElementInViewport(el, fn));
    attachEvent('resize', givenElementInViewport(el, fn));
  }
}

//load images
var el = document.getElementById('loadImagesSection');
addViewportEvent(el, function() {
  if (typeof window.loadImagesDone === 'undefined') {
    window.loadImagesDone = true;
    loadImages();
  }
});

function loadImages(isReplay) {
  
  var imgs = ['1', '2', '3'];
  
  if (typeof window.replayLoadImages === 'undefined') {
    window.replayLoadImages = 1;
  } else {
    window.replayLoadImages++;
  }
  
  for (var img in imgs) {
    (function(imgName) {
      var req = new XMLHttpRequest();
      req.onprogress = function(evt) {
        if (evt.lengthComputable) 
        {
          var percentComplete = (evt.loaded / evt.total) * 100;
          progressJs("img[data-img='" + imgName + "']").set(percentComplete);
        }
      }
      
      req.onreadystatechange = function() {
        if (req.readyState == 4) 
        {
          if (req.status == 200)
          {
            setTimeout(function() {
              progressJs("img[data-img='" + imgName + "']").end();
              document.querySelector("img[data-img='" + imgName  + "']").src = 'images/loadpictures/' + imgName + '.jpg?v=' + window.replayLoadImages + imgName;
            }, 500);
          }
        }
      };
      
      req.open("GET", "images/loadpictures/" + imgName + ".jpg?v=" + window.replayLoadImages + imgName, true);
      req.send();
      progressJs("img[data-img='" + imgName + "']").setOptions({overlayMode: true, theme: 'blueOverlayRadiusWithPercentBar'}).start();
    })(imgs[img]);
  }
}

//text count progress bar
var textCountElement = document.getElementById("textCountProgress");
window.autoSaveTimer = null;
window.clickedOnSave = false;
textCountElement.onkeyup = function() {
  if (window.autoSaveTimer != null || window.clickedOnSave === true)
    return;

  window.autoSaveTimer = setTimeout(function() {
    document.getElementById("saveButton").innerText = "Auto saving...";
    document.getElementById("saveButton").className += "disable";
    
    var prgjs = progressJs("#textCountProgress").setOptions({ theme: 'blackRadiusInputs' }).start();

    (function(prgjs) {
      setTimeout(function() {
        prgjs.end();
        clearTimeout(window.autoSaveTimer);
        window.autoSaveTimer = null;

        document.getElementById("saveButton").innerText = "Save";
        document.getElementById("saveButton").className = document.getElementById("saveButton").className.replace(/disable/gi, "");
      }, 5000);
    })(prgjs);

    prgjs.set(100);
  }, 2000);
};

document.getElementById("saveButton").onclick = function() {
  var self = this;
  if (/disable/gi.test(this.className) === false) {
    if (document.getElementById("textCountProgress").value != "") {
      self.innerText = "Saving...";
      window.clickedOnSave = true;
      var saveBtnPrg = progressJs("#saveButton")
          .setOptions({ theme: 'blueOverlayRadiusHalfOpacity', overlayMode: true })
          .start().onbeforeend(function() { 
            self.innerText = "Saved!"; 
            window.clickedOnSave = false; 
            setTimeout(function() {
              self.innerText = "Save";
            }, 800);
          });
      
      setTimeout(function() {
        saveBtnPrg.increase(100).end();
        document.getElementById("saveButton").blur();
      }, 50);
    } else {
      alert("Type something in textbox first.");
    }
  }
}

var textareaCount = document.getElementById("countTextarea");
var characterCounter = document.getElementById("characterCounter");

function countCharacters() {
  var prgjs = progressJs("#countTextarea").setOptions({ theme: 'blackRadiusInputs' }).start();
  
  var length = textareaCount.value.length;
  var maxLength = textareaCount.getAttribute("maxlength");
  var progress = length / maxLength * 100;
  
  prgjs.set(progress);
  characterCounter.textContent = maxLength - length;
}

textareaCount.onkeypress = textareaCount.onkeyup = countCharacters;
countCharacters();