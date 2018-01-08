$(window).ready(function() {

	$('#column-selections').show();
	
	var getQueryString = function ( field, url ) {
	    var href = url ? url : window.location.href;
	    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
	    var string = reg.exec(href);
	    return string ? string[1] : null;
	};

	//console.log(getQueryString('com'));
	//console.log(getQueryString('model'));

	var comID = getQueryString('com');
	var modelID = getQueryString('model');

	var svgName = modelID + "_" + comID + ".svg";
	var svgNameRev = modelID + "_" + comID + "_rev.svg";

	var ajaxURL = "/oakwood/api/"+modelID+"/" + comID;

	var elevPath = "elevations/"+modelID+"_"+comID+"/";

	//console.log(ajaxURL);

	var totalFloors = 0;
	var $xml;

	var arrayList = [];

	var json;
	var json2;

	$.get(svgName, function(svg) {
		 $xml = svg;

		 $.get( ajaxURL, function(data) {
		 	json = $.parseJSON(data);
			json2 = $.parseJSON(json[0]['Options']);
		 	parse_floor_data();
		 });
		 
	}, 'xml');

	function parse_floor_data() {
		//console.log($xml);

		$($xml).find('svg > g').each(function() {
			var thisID = $(this).attr('id');
			//console.log(thisID);
			var thisIDPart = thisID.split(":-:");

			if(thisIDPart.length > 1) {

				//Begin Calculate Total Floors
				var floorCount = thisIDPart[1].split("");
				floorCount = floorCount.length;
				if(floorCount > totalFloors) {
					totalFloors = floorCount;
				}
				//End Calculate Total Floors

				//arrayList.push(thisIDPart[0]);
				var tempArray = arrayList[thisIDPart[0]] = [];
				//console.log(thisIDPart[0]);
				arrayList.push(tempArray);
			}
		});

		$.unique(arrayList);


		$($xml).find('svg > g').each(function() {
			var thisID = $(this).attr('id');
			var thisIDPart = thisID.split(":-:");

			if(thisIDPart.length > 1) {
				
				var arrayKey = thisIDPart[0];
				var arrayData = thisIDPart.shift();
				var recombind = thisIDPart.join(":-:");

				arrayList[arrayKey].push(recombind);
			}
		});

		for(var i = 0; i < totalFloors; i++) {
			//console.log(i);
			if(i == 0) {
				var textValue = "First Floor";
				var inputValue = "_1stFloor";
				var checked = "";
			} else if(i == 1) {
				var textValue = "Second Floor";
				var inputValue = "_2ndFloor";
				var checked = "";
			} else {
				var textValue = "Basement";
				var inputValue = "basement";
				var checked = "";
			}

			var id_attr = "floor_selection_" + i
			var appendContent = '\
				<div class="checkbox form-input">\
				'+textValue+'\
					<label class="text-wrapper-label switch">\
						\
						<input id="'+id_attr+'" class="amenities-input floor-data" data-floors="'+inputValue+'" type="checkbox" '+checked+' data-toggle="toggle" data-size="small" value="'+textValue+'">\
						<div class="slider round"></div>\
					</label>\
				</div>';

			$('#column-floors .form-group').append(appendContent);
		}

		setupSelections();
	};









	function setupSelections() {
		//console.log(json2)
		//console.log(arrayList);
		console.log(json2);
		$.each(json2, function(index, value) {
			
			var letters = /[A-Z]+$/;
			var lettersLower = /[a-z0-9]+$/;

			if(index == "REVERSEPLAN") {
				for(i = 0; i < value['Choices'].length; i++) {
					var class_prefix = "REVERSEPLAN";
					var class_prefix_final = class_prefix + "_" + i;
					
					var inputVal = value['Choices'][i]['ID'].replace("||", "");
					if(value['Choices'][i]['Value'] == "true") {
						var checkedValue = "checked";
					} else {
						var checkedValue = "";
					}

					var appendContent = '\
						<div class="checkbox form-input">\
						'+value['Choices'][i]['Text']+'\
							<label class="text-wrapper-label switch">\
								\
								<input id="'+class_prefix_final+'" class="amenities-input reverse-plan-input" type="checkbox" '+checkedValue+' data-floors="fsbe" data-toggle="toggle" data-size="small" value="'+inputVal+'">\
								<div class="slider round"></div>\
							</label>\
						</div>';

					$('#column-selections .group-selections').append(appendContent);
				}

				
			}
			
			if(index.match(letters) && index in arrayList) {
				var class_prefix = index;
				var arrayData = arrayList[index][0];
				arrayData = arrayData.split(":-:");

				for(i = 0; i < value['Choices'].length; i++) {
					
					var class_prefix_final = class_prefix + "_" + i;
					var class_prefix_final2 = class_prefix + class_prefix + "_" + i;
					
					var inputVal = value['Choices'][i]['ID'].replace("||", "");
					if(value['Choices'][i]['Value'] == "true") {
						var checkedValue = "checked";
					} else {
						var checkedValue = "";
					}

					// if() {

					// }
					

					if(value['Choices'][i]['Text'] != "Not Selected" && index != "ELEVATION") {
						var appendContent = '\
							<div class="checkbox form-input">\
							'+value['Choices'][i]['Text']+'\
								<label class="text-wrapper-label switch">\
									\
									<input id="'+class_prefix_final+'" class="amenities-input feature-input" type="checkbox" '+checkedValue+' data-floors="'+arrayData[0]+'" data-toggle="toggle" data-size="small" value="'+inputVal+'">\
									<div class="slider round"></div>\
								</label>\
							</div>';

						$('#column-selections .group-selections').append(appendContent);

					} else if(index == "ELEVATION") {
						if(value['Choices'][i]['Value'] == "true") {
							var checkedValue = "checked";
						} else {
							var checkedValue = "";
						}
						var appendContent = '\
							<div class="checkbox form-input">\
							'+value['Choices'][i]['Text']+'\
								<label class="text-wrapper-label switch">\
									\
									<input id="'+class_prefix_final+'" class="amenities-input feature-input" type="checkbox" '+checkedValue+' data-floors="'+arrayData[0]+'" data-toggle="toggle" data-size="small" value="'+inputVal+'">\
									<div class="slider round"></div>\
								</label>\
							</div>';

						var appendContent2 = '\
							<div class="checkbox form-input">\
							'+value['Choices'][i]['Text']+'\
								<label class="text-wrapper-label switch">\
									\
									<input id="'+class_prefix_final2+'" class="amenities-input elevation-input" type="checkbox" '+checkedValue+' data-floors="'+arrayData[0]+'" data-toggle="toggle" data-size="small" value="'+inputVal+'">\
									<div class="slider round"></div>\
								</label>\
							</div>';

						$('#column-elevations .group-selections').append(appendContent2);
						$('#column-selections .group-selections').append(appendContent);
					}

					
				}
				//$('.group-selections')append();
			} else if(index.match(lettersLower) && index in arrayList) {
				//console.log(index)
				var arrayData = arrayList[index][0];
				arrayData = arrayData.split(":-:");
				if(arrayData.length > 1) {
					var dataCombined = 'data-combined="'+arrayData[1]+'"';
				} else {
					var dataCombined = "";
				}

				if(value['Value'] == "true") {
					var checkedValue = "checked";
				} else {
					var checkedValue = "";
				}

				if(index != "ELEVATION") {
					var appendContent = '\
						<div class="checkbox form-input">\
						'+value['Text']+'\
							<label class="text-wrapper-label switch">\
								\
								<input id="'+value['ID']+'" class="amenities-input feature-input" '+dataCombined+' type="checkbox" '+checkedValue+' data-floors="'+arrayData[0]+'" data-toggle="toggle" data-size="small" value="">\
								<div class="slider round"></div>\
							</label>\
						</div>';

					$('#column-selections .group-selections').append(appendContent);

				}
			}

		});

		$("#floor_selection_0").click();

		setTimeout(function() {
			loadSVG();
		}, 1000);

	};






	//var svgName = modelID + "_" + comID + ".svg";
	//var svgNameRev = modelID + "_" + comID + "_rev.svg";

	function loadSVGRev() {
		$('#svgfile').load(svgNameRev, function() {
			var panZoomSVG = svgPanZoom('#Layer_1');
			updateSVG();
		});
	}


	function loadSVG() {
		$('#svgfile').load(svgName, function() {
			var panZoomSVG = svgPanZoom('#Layer_1', {
				zoomEnabled: true,
         		controlIconsEnabled: true,
          		fit: true,
          		center: true,
			});
			updateSVG();

		});
	}











	function updateSVG() {
		var floor_data = $('input.floor-data:checked').val();

		if(floor_data == "First Floor") {
			var activeFloor = "f";
		} else if(floor_data == "Second Floor") {
			var activeFloor = "s";
		} else if(floor_data == "Basement") {
			var activeFloor = "b";
		}
		
		//console.log(activeFloor);

  		$('input.reverse-plan-input').each(function() {
  			if($(this).val() == "REVERSE_YES" && $(this).is(':checked')) {
  				//$('svg').addClass('flip_plan');
  			} else {
  				//$('svg').removeClass('flip_plan');
  			}
  		});

		$("input.floor-data").each(function() {
			var floorValue = $(this).attr("data-floors");

			if($(this).is(':checked')) {
				$('g#' + floorValue).css('display', "block");
			} else {
				$('g#' + floorValue).css('display', "none");
			}
		});


		$("input.feature-input").each(function() {
			var inputID = $(this).attr('id');
			var idSearch = inputID.split("_");
			var inputValue = $.trim($(this).val());
			var numbersearch = /[0-9]+$/;

			//console.log(inputValue);
			//console.log(inputID);

			if(inputID.match(numbersearch)) {
				var inputIDClean = inputID.replace(/\d+$/, "");
				inputIDClean = inputIDClean.replace(/_$/,"");
				//console.log(inputIDClean);
			} else {
				var inputIDClean = inputID;
			}

			//console.log(inputIDClean);

			if($(this).is(':checked')) {
				if(inputIDClean == "ELEVATION") {
					var elevationSearch = inputValue + ":-:" + activeFloor;
					//console.log(elevationSearch);

					$('svg').find('> g').each(function() {
						var svgID = $(this).attr("id");
						var availFloors = svgID.split(":-:");
						availFloors = availFloors[1];

						if(svgID.indexOf(elevationSearch) != -1) {
							console.log("found");
							$(this).css('display', "block");
						} else if(svgID.indexOf("ELEVATION") != -1 && svgID.indexOf(elevationSearch) == -1) {
							$(this).css('display', "none");
						}

					});

				} else {
					if(inputValue !== "") {
						//console.log("Has Value");
						$('svg').find('> g').each(function() {
							var svgID = $(this).attr("id");
							var availFloors = svgID.split(":-:");
							availFloors = availFloors[1];
							//console.log(svgID);
							if(svgID.indexOf(inputValue) != -1 && availFloors.indexOf(activeFloor) != -1) {
								//console.log(inputValue);
								$(this).css('display', "block");
							}
						});
					} else {
						$('svg').find('> g').each(function() {
							var svgID = $(this).attr("id");
							svgID = svgID.split(":-:");
							var availFloors = svgID[1];
							if(svgID[0].indexOf(inputIDClean) != -1 && availFloors.indexOf(activeFloor) != -1) {
								$(this).css('display', "block");
								$(this).css('color', "green");
							}
						});
					}
				}

				
			} else {
				//console.log("unchecked");
				if(inputIDClean == "ELEVATION") {
					var elevationSearch = inputValue + ":-:" + activeFloor;
					//console.log(elevationSearch);
					$('svg').find('> g').each(function() {
						var svgID = $(this).attr("id");
						var availFloors = svgID.split(":-:");

						if(svgID.indexOf(elevationSearch) != -1) {
							console.log("found");
							$(this).css('display', "none");
						} 
						// else if(svgID.indexOf("ELEVATION") != -1 && svgID.indexOf(elevationSearch) != -1) {
						// 	$(this).css('display', "none");
						// }

					});
				} else {
					if(inputValue != "") {
						$('svg').find('> g').each(function() {
							var svgID = $(this).attr("id");

							if(svgID.indexOf(":-:") != -1) {
								var availFloors = svgID.split(":-:");
								availFloors = availFloors[1];
								if(availFloors.indexOf(activeFloor) == -1) {
									//console.log("Wrong Floor");
									$(this).css('display', "none");
								}
							}

							//console.log(svgID);
							if(svgID.indexOf(inputValue) != -1) {
								//console.log("match");
								$(this).css('display', "none");
							}


						});
					} else {
						//console.log("else");
						$('svg').find('> g').each(function() {
							var svgID = $(this).attr("id");
							svgID = svgID.split(":-:");
							var availFloors = svgID[1];

							if(svgID[0].indexOf(inputIDClean) != -1 && availFloors.indexOf(activeFloor) != -1) {
								$(this).css('display', "none");
								$(this).css('color', "red");
							}

							if(svgID.length > 1) {
								if(availFloors.indexOf(activeFloor) == -1) {
									//console.log("Wrong Floor");
									$(this).css('display', "none");
								}
							}

						});
					}
				}

				
			}
		});
	}



$('input.reverse-plan-input').each(function() {
  			if($(this).val() == "REVERSE_YES" && $(this).is(':checked')) {
  				//$('svg').addClass('flip_plan');
  			} else {
  				//$('svg').removeClass('flip_plan');
  			}
  		});



	$(document).on('click','input.amenities-input', function() {
		var currentID = $(this).attr('id');

		var inputIDClean = currentID.replace(/[0-9]/g, "");
		inputIDClean = inputIDClean.replace(/_$/,"");

		var idSearch = currentID.split("_");
		var currentValue = $(this).val();
		//console.log("clicked");
		//console.log(currentID);
		//data-combined

		if($(this).is(':checked')) {

			if($(this).attr('data-combined')) {
				var dataCombined = $(this).attr('data-combined')
				$("input.amenities-input").each(function() {
					if($(this).attr('data-combined') == dataCombined && $(this).attr('id') != currentID) {
						$(this).attr('checked', false);
					}
				});

			} else {
				$("input.amenities-input").each(function() {
					if($(this).attr('id') != currentID && $(this).attr('id').indexOf(inputIDClean) != -1) {
						$(this).attr('checked', false);
					}
				});
			}

			if($(this).hasClass("elevation-input")) {
				//console.log();
				var elevImagePath = elevPath + $(this).val() + ".jpg";
				$('#svgfile').html("<img src='"+elevImagePath+"' class='img-responsive' />");

			}

			if($(this).hasClass("reverse-plan-input")) {
				if($(this).val() == "REVERSE_YES") {
					loadSVGRev();
				} else {
					loadSVG();
				}
			}
			
		} else {
			$("input.amenities-input").each(function(index) {
				if($(this).attr('id').indexOf(inputIDClean + "_0") != -1) {
					console.log("found " + $(this).attr('id'));
					$(this).prop('checked', true);

					if($(this).hasClass("reverse-plan-input")) {
						if($(this).val() == "REVERSE_YES") {
							loadSVGRev();
						} else {
							loadSVG();
						}
					}
				}
			});

		}

		if($(this).attr('id').indexOf('floor_selection_') != -1) {
			if($(this).val() == "First Floor") {
				var floorSearch = "f";
			} else if($(this).val() == "Second Floor") {
				var floorSearch = "s";
			} else if($(this).val() == "Basement"){
				var floorSearch = "b";
			}

			$('#column-selections').find('input.amenities-input').each(function() {
				//console.log($(this));
				var dataToCheck = $(this).attr("data-floors");
				//console.log(dataToCheck);
				if(dataToCheck.indexOf(floorSearch) != -1) {
					$(this).parent().parent().show();
				} else {
					$(this).parent().parent().hide();
				}
			});
		}

		if(!$(this).hasClass("elevation-input")) {
			updateSVG();
		}
		//updateSVG();
	});


	$('.toggle-options').on('click', function(event) {
		event.preventDefault();
		var selectionVal = $(this).text();
		selectionVal = selectionVal.toLowerCase();

		if(selectionVal == "floors") {
			$('.middle-column:visible').slideUp(function() {
				$('#column-floors').slideDown();
				loadSVG();
			});
			
		} else if(selectionVal == "selections") {
			$('.middle-column:visible').slideUp(function() {
				$('#column-selections').slideDown();
				loadSVG();
			});
			
		} else if(selectionVal == "furniture") {
			$('.middle-column:visible').slideUp(function() {
			});
		} else if(selectionVal == "elevations") {
			$('.middle-column:visible').slideUp(function() {
				$('#column-elevations').slideDown();
			});
			
		}
	});

	// $("#Layer_1").uberZoom({
	// 	width : 960,
	// 	height : 400,
	// 	fullscreen : true
	// });

	//var panZoomSVG = svgPanZoom('#Layer_1');

});


























