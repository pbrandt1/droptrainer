var DropTrainer = function(options) {
	if (!(this instanceof DropTrainer)) {
		return new DropTrainer(options);
	}

	var me = this;

	options = options || {};

	/**
	 * audioFiles is an array of music that someone had dragged and dropped in
	 * @type {Array|*}
	 */
	this.audioFiles = options.audioFiles || [];

	/**
	 * List of {song:s, duration: d} objects
	 * @type {Array}
	 */
	this.metaDataList = [];

	/**
	 * Keeps track of the total length of the workout
	 * @type {number}
	 */
	this.totalDuration = 0;

	/**
	 * difficulty is a number from 0 to 10 indicating the user's desired difficulty
	 * it has no physical meaning
	 * @type {number|*}
	 */
	this.difficulty = options.difficulty || 5;

	/**
	 * Array of {duration: seconds, difficulty: 0-10} objects
	 * @type {Array}
	 */
	this.trainingProgram = [];

  /**
   * audio player
   * @type {Audio}
   */
  this.player = new Audio();

	/**
	 * Attach event listeners to the element
	 * Event listeners modify the classes on the element
	 *
	 */
	if (!options.el) {
		throw new Error("sucka forgot to attach DropTrainer to a div with options.el");
	}
	var el = this.el = options.el;
	var $el = this.$el = $(el);

	/**
	 * Add the "incoming" class on file hover
	 */
	$el.on('dragenter', function() {
		event.preventDefault();
		$el.addClass('incoming');
	});

	/**
	 * Remove the "incoming" class on file leave from hover
	 */
	$el.on('dragleave', function() {
		$el.removeClass('incoming');
	});

	$el.on('dragover', function() {
		event.preventDefault();
		$el.addClass('incoming');
	});

	/**
	 * Ingest the file when it's plopped or dropped
	 */
	$el.on('drop dragdrop', function() {
		event.preventDefault();

		if (!event.dataTransfer) {
			return;
		}

		Array.prototype.forEach.call(event.dataTransfer.files, function(file) {
			me.addFile(file);
		});
	});

	/**
	 * Run a whole bunch of stuff when the audio time changes
	 */
	this.player.ontimeupdate = function() {
		$("#trainer .elapsed").html(niceTime(event.currentTarget.currentTime));
	}
};


/**
 * Safely gets the difficulty, returning a number between 0 and 10.
 * @returns {*}
 */
DropTrainer.prototype.getDifficulty = function() {
	if (this.difficulty <= 0) {
		return 0;
	} else if (this.difficulty >= 10) {
		return 10;
	} else {
		return this.difficulty;
	}
};

/**
 * Safely handles an incoming file by checking the type and then adding to the
 * @param file
 */
DropTrainer.prototype.addFile = function(file) {
	var me = this;

	// check type
	if (!file || !file.type || !file.type.indexOf('audio') < 0) {
		return alert('yo dawg only add audio files!');
	}

	// get the length of it
	var audio = document.createElement('audio');
	var $audio = $(audio);
  var audioURL = URL.createObjectURL(file);
	$audio.on('canplaythrough', function(e) {
		var seconds = e.currentTarget.duration;
		me.audioFiles.push(file);
		me.$el.append('<div>' + file.name + ' [' + niceTime(seconds) + ']</div>');
		me.totalDuration += seconds;
		$("#trainer .timer .total").html(niceTime(droptrainer.totalDuration));
		me.metaDataList.push({song: file.name, duration: seconds});

		me.trainingProgram = trainerProgram.computeTrainingProgram(me.metaDataList);

    // also queue it up if it's the first one
    if (me.audioFiles.length == 1) {
      $(me.player).attr('src', audioURL);
    }

	});
	$audio.attr('src', audioURL);

	console.log('adding file', file.name);



};

/**
 * Turns seconds into h:mm:ss
 * @param s
 * @returns {string}
 */
var niceTime = function(s) {
	var duration = moment.duration(s, 's');
	var hourString = duration.hours() ? duration.hours() + ':' : '';
	var minuteString = duration.minutes() < 10 ? '0' + duration.minutes() : duration.minutes();
	var secondsString = duration.seconds() < 10 ? '0' + duration.seconds() : duration.seconds();

	return hourString + minuteString + ':' + secondsString;
};



/**
 * init DropTrainer
 */
var droptrainer = new DropTrainer({
	el: document.getElementById('dropzone')
});

/**
 * State transitions
 * basically set up all the wacky visualizations that happen when you click GO
 */
(function() {
	var STATE = {reset: 0, playing: 1, paused: 2};
	var _state = STATE.reset;
	$('#go').on('click', function() {
		if (_state == STATE.reset) {
			_state = STATE.playing;

			$("#train .content").css('left', '-165%'); // GTFO, hint box

			setTimeout(function() {
				$("#train .app").addClass('training');

				$("#train .app .timer").show();

				droptrainer.player.load();
				droptrainer.player.play();

			}, 200);

		} else if (_state == STATE.paused) {
			_state = STATE.playing;
			droptrainer.player.play();
		} else {
			_state = STATE.paused;
			droptrainer.player.pause();
		}
	});
})();