(function () {
  if (!window.document.documentMode) {
    // //For H5P Subtitle
    var subtitle = document.createElement('div');
    var subtitleInner = document.createElement('span');
    subtitle.className = 'H5PCaption';
    subtitle.setAttribute('id', 'playerCaptions');
    subtitle.appendChild(subtitleInner);
    subtitle.style.display = 'none';
    var subtitleMain = setInterval(function () {
      var textTrackElem = document.getElementsByTagName('track')[0];
      if (textTrackElem != undefined) {
        textTrackElem.parentElement.parentElement.appendChild(subtitle);
        textTrackElem.addEventListener('cuechange', function (event) {
          let cues = event.target.track.activeCues;
          if (cues[0] != undefined) {
            subtitleInner.innerHTML = cues[0].text;
            subtitle.style.display = 'block';
          } else {
            subtitle.style.display = 'none';
          }

          var list = document.querySelectorAll(
            '.h5p-captions [role="menuitemradio"]'
          );
          list.forEach(function (event, index) {
            event.addEventListener('click', function (evt) {
              evt.currentTarget.getAttribute('aria-checked') == 'true'
                ? evt.currentTarget.innerHTML == 'Off' &&
                  (subtitle.style.display = 'none')
                : (subtitle.style.display = 'block');
            });
          });
        });
      }
    }, 1000);

    setTimeout(function () {
      clearInterval(subtitleMain);
    }, 20000);
  }
})();
