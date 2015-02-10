(function($) {
	
	// Set Popup
	$.fn.displayPopUp = function(content, f) {
		var el = $(this),
			_html = content || '';
		el.fadeIn(function() {
			if (typeof f === "function") f();
		}).css('display','table').find('.popup-wrapper').html(_html);
	};

	/* ------------------------------------------
	 * Click Events called on DOM Ready
	 * -----------------------------------------*/
	$(document).ready(function() {
		// Instantiate GuessingGame
		var guess_game = new $.GuessingGame('#ticker', '#status', '#moves');

		// On clicking start Button
		$('#start-guess').one('click', function(e) {
			e.preventDefault();

			// Generate random number
			if (guess_game.generatedNum === null)
				guess_game.generateNumber();

			// Hide the start button
			$(this).fadeOut(function() {
				console.log(guess_game);
			});
		});

		// On Submit
		$('#guess-number').on('submit', function(e) {
			e.preventDefault();

			// Check how many moves there are first
			if (!guess_game.checkMovesLeft()) {
				guess_game.displayStatus("You have no moves left! Game over. gg");
				return false;
			}

			var _submit = $(this).serializeArray()[0],
				check_num = guess_game.validateNumber(_submit),
				error_msg = null;
			
			if (!check_num.no_error) {
				switch (check_num.error_type) {
					case 0: // Not a number
						error_msg = "You have to guess a number!";
						break;
					case 1: // Not inbound the guessing limits
						error_msg = "Guess between " + guess_game.guessLimit[0] + " and " + guess_game.guessLimit[1] + "!";
						break;
				}
			}

			if (null !== error_msg) {
				guess_game.displayStatus(error_msg);
				return false;
			} else {
				// count the moves left
				guess_game.countMove();

				// Get how close the user is
				var gap = guess_game.checkNumber(_submit.value),
					degree = guess_game.checkDegree(gap);
				console.log(gap);
				console.log(degree);
				guess_game.displayStatus(gap);
				// Animate the ticker
				guess_game.tick(degree);
			}
		});
	});
})(jQuery);