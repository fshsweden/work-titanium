/*
 * CHECK WHETHER THESE TWO 'CLASSES' WORKS AS EXPECTED
 */
exports.countDown = function(h, m, s, fn_tick, fn_end) {
	
	// returns a hash with properties and methods
	return {
		total_sec	: h * 3600 + m * 60 + s,
		timer		: this.timer,
		set			: function(h, m, s) {
			this.total_sec = parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s);
			this.time = {
				h : h,
				m : m,
				s : s
			};
			return this;
		},
		start		: function() {
			var self = this;
			this.timer = setInterval(function() {
				if (self.total_sec) {
					self.total_sec--;
					self.time = {
						h : parseInt(self.total_sec / 3600),
						m : parseInt(self.total_sec / 60),
						s : (self.total_sec % 60)
					};
					fn_tick();
				} else {
					self.stop();
					fn_end();
				}
			}, 1000);
			return this;
		},
		stop			: function() {
			clearInterval(this.timer);
			this.time = {
				h : 0,
				m : 0,
				s : 0
			};
			this.total_sec = 0;
			return this;
		}
	};
};

exports.timerTicker = function(h, m, s, interval) {
	return {
		timer : this.timer,
		start : function() {
			var self = this;
			this.timer = setInterval(function() {
				fn_tick();
			}, interval);
			return this;
		},
		stop : function() {
			clearInterval(this.timer);
			this.time = {
				h : 0,
				m : 0,
				s : 0
			};
			this.total_sec = 0;
			return this;
		}
	};
};
