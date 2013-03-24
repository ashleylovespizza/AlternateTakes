require(["jquery", "Score", "http://vjs.zencdn.net/c/video.js"], function($, Score) {
    $(function() {
      var score = new Score("/video_source/starwars_trashcompactor/starwars_trashcompactor.txt");
    });
});