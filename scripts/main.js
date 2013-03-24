require(["jquery", "Score", "Stage", "http://vjs.zencdn.net/c/video.js"], function($, Score, Stage) {
    $(function() {
      Score.loadFile("/video_source/starwars_trashcompactor/starwars_trashcompactor.txt");
      var stage = $('#stage').Stage();
    });
});