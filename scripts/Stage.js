define('Stage', ['jquery', 'Score', 'SelectScreen', 'Level'], function($, Score, SelectScreen, Level){

	var Stage = function(canvas) {
		console.log("STAGE!!")
		var self = this;
		self.overlay = canvas;
		self.curr_stage = canvas;
		self.STAGE_ORDER = ['level1', 'level2', 'level3'];

		// begin listener for stageReturn - this is fired every time a given stage ends and has no directive
     //   $(document).on("gotoNextStage", Stage.gotoNextStage);
     // 	$(document).on("gotoNextStage", $.proxy(Stage.gotoNextStage, this));
    //    $(this).trigger('gotoNextStage');

    	//always start out on select screen
    	self.gotoSelectScreen();

    	$(document).on("back_to_select", function(e){
			self.gotoSelectScreen();
    	})
	}



	Stage.prototype.gotoLevel = function(level) {
		var self = this;

		self.clearStage();

		console.log(self.STAGE_ORDER)
		var leveltype = String(self.STAGE_ORDER[level]);

    	Score.loadFile("/levels/"+leveltype+"/"+leveltype+".txt");
    	this.curr_stage = new Level(self.overlay, "levels/"+leveltype+"/"+leveltype+".mp4");
	}


	Stage.prototype.clearStage = function(){
		Score.clearScore();
		this.curr_stage = null;
	}


	Stage.prototype.gotoSelectScreen = function(){
		var self = this;
		self.clearStage();

		// called when it's damn appropriate to call it
		this.curr_stage = new SelectScreen(self.overlay, this);

	}





	return Stage;


		
		
});