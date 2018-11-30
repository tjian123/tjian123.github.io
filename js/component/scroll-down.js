(function($){
	var total = $(".post-list > .post-item").length;
	var inactive = $(".post-list > .post-item + .item-hidden").length;
	$("#scroll-down").on("click", function(e){
		e.preventDefault();
		inactive = $(".post-list > .post-item + .item-hidden").length;
		var next = 0;
		if (inactive <= 5) {
			$("#scroll-down").parent().addClass("item-hidden");
		}
		if (inactive < 5) {
			next = inactive % 5;
		} else {
			next = 5;
		}
		for(var i=0; i < next; i++) {
			$(".post-list > .post-item + .item-hidden:first").removeClass("item-hidden");
		}
	})
})($);