function ApplicationWindow(title) {
	
	alert("ApplicationWindow!!!");
	
	var self = Ti.UI.createWindow({
		title:title,
		layout:'vertical',
		backgroundColor:'white'
	});
	
	self.demo = function() {
		
		var img = Ti.UI.createImageView(
			{
				image: '/images/KS_nav_ui.png'
			}
		);
		
		var h	= Ti.Platform.displayCaps.platformHeight;
		var w	= Ti.Platform.displayCaps.platformWidth;
		
	/*	for (r=0; r<10; r++) {
			var locseperator=Ti.UI.createLabel({
			    height:2,
			    width:w,
			    top:100+(r*10),
			    left:1,
			    backgroundColor:'#000'
			});		
			self.add(locseperator);
		}
	*/	
		
		var count=0;
		var anim = function() {
			// img.x = img.x + 10;
			alert("Hej " + count);
			
			// if (img.x < 300) {
			//	setTimeout(f, 500);		
			//}
			
			count = count+1;
			if (count < 5) {
				alert("Reschedule timeout because count is " + count);
				setTimeout(anim,1000);
			}
		}
		
		anim();	
		
		var button = Ti.UI.createButton({
	//		top:20,
	//		height:44,
	//		width:200,
	
			left:10,
			top:10,
			title:L('openWindow')
		});
		self.add(button);
	
		var button2 = Ti.UI.createButton({
	//		top:20,
	//		height:44,
	//		width:200,
			left: 200,
			top:200,
			title:L('openWindow2')
		});
		self.add(button2);
		
		var button3 = Ti.UI.createButton({
	//		top:20,
	//		height:44,
	//		width:200,
	
	
			 top: 600,
			left: 600,
			title:L('openWindow3')
		});
		self.add(button3);
		
		button.addEventListener('click', function() {
			//containingTab attribute must be set by parent tab group on
			//the window for this work
			self.containingTab.open(Ti.UI.createWindow({
				title: L('newWindow'),
				backgroundColor: 'white'
			}));
		});
		
		
		self.addEventListener('touchstart', function(e) {
			button.x = e.x;
			button.y = e.y;
		});
	
		self.addEventListener('touchmove', function(e) {
			Ti.API.info("move:" + e.x + " " + e.y);
			button.x = e.x;
			button.y = e.y;
		});
	
		self.addEventListener('touchend', function(e) {
			
		});
		
	} // end of self-demo	
	
	return self;
};

module.exports = ApplicationWindow;
