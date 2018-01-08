$(document).ready(function() {
	$('input').on('click', function() {

		if($(this).attr('name') == "load-vr") {
			if($(this).is(':checked')) {
				var currentValue = $(this).val();
				var elevation = $('input[name="elevation"]:checked').val();
				var garage = $('input[name="garage"]:checked').val();
				var sunroom = $('input[name="sunroom"]:checked').val();
				var view = $('input[name="view"]:checked').val() + "_";
				var imagebase = "images/Foster_Ext_";

				var iFrameURLBase = "http://digitalempireweb.com/Foster_Int_FamilyRoom_";
				var iframeURL = iFrameURLBase + elevation;
				if(sunroom != "") {
					var iframeURL = iFrameURLBase + elevation + "_PlusSunroom";
				} else {
					var iframeURL = iFrameURLBase + elevation;
				}
				$('#image-wrapper img').hide();
				$('iframe#load').attr('src', iframeURL).show();
			} else {
				$('#image-wrapper img').show();
				$('iframe#load').attr('src', iframeURL).hide();
			}
			
			
		} else {

			if($(this).attr('name') == "sunroom") {
				if($('input[name="load-vr"]').is(':checked')) {
					var elevation = $('input[name="elevation"]:checked').val();
					var garage = $('input[name="garage"]:checked').val();
					var sunroom = $('input[name="sunroom"]:checked').val();
					var view = $('input[name="view"]:checked').val() + "_";
					var imagebase = "images/Foster_Ext_";

					var iFrameURLBase = "http://digitalempireweb.com/Foster_Int_FamilyRoom_";
					var iframeURL = iFrameURLBase + elevation;
					if(sunroom != "") {
						var iframeURL = iFrameURLBase + elevation + "_PlusSunroom";
					} else {
						var iframeURL = iFrameURLBase + elevation;
					}
					$('iframe#load').attr('src', iframeURL);
				}

			} else {
				$('iframe#load').attr('src', "").hide();
				$('input[name="load-vr"]').attr('checked', false);
				var elevation = $('input[name="elevation"]:checked').val();
				var garage = $('input[name="garage"]:checked').val();
				var sunroom = $('input[name="sunroom"]:checked').val();
				var view = $('input[name="view"]:checked').val() + "_";
				var imagebase = "images/Foster_Ext_";
				

				var baseimage = imagebase + view + elevation + ".jpg";

				$('#baseline').attr('src', baseimage).show();
				
				if(sunroom != "") {
					sunroom = "_" + sunroom + ".png";
					var overlaysunroom = imagebase + view + elevation + sunroom;
					$('.sunroom').attr('src', overlaysunroom).show();
				} else {
					$('.sunroom').hide();
				}
				

				if(garage != "") {
					garage = "_" + garage + ".png";
					var overlaygarage = imagebase + view + elevation + garage;
					$('.garage').attr('src', overlaygarage).show();
				} else {
					$('.garage').hide();
				}
			}

			
		}
		
		
	});

});