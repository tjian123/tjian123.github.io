(function($){
	var opened = false;
	var menu = $(".site-nav-menu");
	$("#drop-down-menu").on("click", function(e){
		e.preventDefault();
		if (!opened) {
			menu.css("display", "block");
			$(this).children().addClass("fa-close").removeClass("fa-bars");
			opened = true;
		} else {
			menu.css("display", "none");
			$(this).children().addClass("fa-bars").removeClass("fa-close");
			opened = false;
		}
	})
})($);