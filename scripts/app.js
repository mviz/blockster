//LINK: http://www.html5rocks.com/en/tutorials/appcache/beginner/

window.addEventListener('load', function(e) {

  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      //TODO: this is horrendous.
      if (confirm('A new version of this site is available. Load it?')) {
        window.location.reload();
      }
    }
  }, false);
}, false);



function appCacheStatus() {
    var appCache = window.applicationCache;

    switch (appCache.status) {
      case appCache.UNCACHED: // UNCACHED == 0
        return 'UNCACHED';
      case appCache.IDLE: // IDLE == 1
        return 'IDLE';
      case appCache.CHECKING: // CHECKING == 2
        return 'CHECKING';
      case appCache.DOWNLOADING: // DOWNLOADING == 3
        return 'DOWNLOADING';
      case appCache.UPDATEREADY:  // UPDATEREADY == 4
        return 'UPDATEREADY';
      case appCache.OBSOLETE: // OBSOLETE == 5
        return 'OBSOLETE';
      default:
        return 'UKNOWN CACHE STATUS';
    }
}
