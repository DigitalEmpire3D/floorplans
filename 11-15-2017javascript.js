$(window).ready(function() {
	var panZoomSVG;
	//var hello = "hello";
	//$('#column-selections').show();
	
	var getQueryString = function ( field, url ) {
	    var href = url ? url : window.location.href;
	    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
	    var string = reg.exec(href);
	    return string ? string[1] : null;
	};

	

	var comID = getQueryString('com');
	var modelID = getQueryString('model');

	var svgName = modelID + "_" + comID + ".svg";
	var svgNameRev = modelID + "_" + comID + "_rev.svg";

	var exlusionFile = modelID + "_" + comID + ".js";

	var ajaxURL = "/oakwood/api/"+modelID+"/" + comID;

	var elevPath = "elevations/"+modelID+"_"+comID+"/";

	//console.log(ajaxURL);

	var totalFloors = 0;
	var $xml;

	var arrayList = [];

	var json;
	var json2;


	var floorArray = [];

	function addRemoveScroll() {
		//var currentHeight = $('#toggle-wrapper').height();

		//console.log($('#toggle-wrapper').hasScrollBar());

		if($('#toggle-wrapper').hasScrollBar()) {
			//$('#toggle-wrapper').addClass('');
			//alert("");
			$('#toggle-header').css('display', "block");
			//$('#toggle-wrapper').css('overflow-y', "scroll");
		} else {
			$('#toggle-header').css('display', "none");
		}
	}

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
			var thisIDPart = thisID.split("---");

			if(thisIDPart.length > 1) {

				//Begin Calculate Total Floors
				var floorCount = thisIDPart[1].split("");
				var floorValues = thisIDPart[1].split("");
				//console.log(floorCount);
				floorCount = floorCount.length;
				if(floorCount > totalFloors) {
					totalFloors = floorCount;
				}

				for(var i = 0; i < floorCount; i++ ) {
					floorArray.push(floorValues[i]);
				}
				//End Calculate Total Floors

				//arrayList.push(thisIDPart[0]);
				var tempArray = arrayList[thisIDPart[0]] = [];
				//console.log(thisIDPart[0]);
				arrayList.push(tempArray);
			}
		});
		//console.log(floorArray);
		$.unique(arrayList);

		$.unique(floorArray);
		//console.log(floorArray);
		var index = floorArray.indexOf("e");
		

		if (index > -1) {
			floorArray.splice(index, 1);
		}

		var index2 = floorArray.indexOf("g");
		if (index2 > -1) {
			floorArray.splice(index2, 1);
		}
		//console.log(floorArray);


		$($xml).find('svg > g').each(function() {
			var thisID = $(this).attr('id');
			var thisIDPart = thisID.split("---");

			if(thisIDPart.length > 1) {
				
				var arrayKey = thisIDPart[0];
				var arrayData = thisIDPart.shift();
				var recombind = thisIDPart.join("---");

				arrayList[arrayKey].push(recombind);
			}
		});

		// for(var i = 0; i < totalFloors; i++) {
		//console.log(floorArray.length);
		floorArray.push(floorArray.shift());
		for(var i = 0; i < floorArray.length; i++) {
			//console.log(i);
			// if(i == 0) {
			// 	var textValue = "First Floor";
			// 	var inputValue = "_1stFloor";
			// 	var checked = "";
			// } else if(i == 1) {
			// 	var textValue = "Second Floor";
			// 	var inputValue = "_2ndFloor";
			// 	var checked = "";
			// } else if(i == 2) {
			// 	var textValue = "Third Floor";
			// 	var inputValue = "_3rdFloor";
			// 	var checked = "";
			// } else {
			// 	var textValue = "Basement";
			// 	var inputValue = "basement";
			// 	var checked = "";
			// }
			if(floorArray[i] == 'b') {
				var textValue = "Basement";
				var inputValue = "basement";
				var checked = "";

			} else if(floorArray[i] == 'f') {
				var textValue = "First Floor";
				var inputValue = "_1stFloor";
				var checked = "";

			} else if(floorArray[i] == 's') {
				var textValue = "Second Floor";
				var inputValue = "_2ndFloor";
				var checked = "";

			} else if(floorArray[i] == 't') {
				var textValue = "Third Floor";
				var inputValue = "_3rdFloor";
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
		$.each(json2, function(index, value) {
			
			var letters = /[A-Z]+$/;
			var lettersLower = /[a-z0-9]+$/;

			var useElevation = false;

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

					$('#column-garage .group-selections').append(appendContent);
				}

				
			}
			//console.log($xml);
			if(index.match(letters) && index in arrayList) {
				//console.log(index);
				var class_prefix = index;
				//console.log(arrayList[index][0])
				var arrayData = arrayList[index][0];
				arrayData = arrayData.split("---");

				

				for(i = 0; i < value['Choices'].length; i++) {
					
					var class_prefix_final = class_prefix + "_" + i;
					var class_prefix_final2 = class_prefix + class_prefix + "_" + i;

					
					var inputVal = value['Choices'][i]['ID'].replace("||", "");

					if(value['Choices'][i]['Value'] == "true") {
						var checkedValue = "checked";
					} else {
						var checkedValue = "";
					}

					// ###############################################################################

					//var $object = $($xml).find('svg > g[id^=A-Z]');
					//console.log($object.attr('data-name'));
					//var foundAttr = $($xml).find('svg > g[id*=":-:'+inputVal+':-:"]').attr('data-name');
					//console.log(foundAttr);
					//console.log(inputVal);
					//console.log($($xml).find('svg > g[id^="FOUNDATION"]').attr('data-name'));
					//console.log($($xml).find('svg > g[id*="fnd_fwout"]'))

					var foundAttr = $($xml).find('svg > g[data-name *="'+inputVal+'"]').attr('data-name');
					//console.log(foundAttr);

					if(typeof foundAttr !== typeof undefined && foundAttr !== false) {
						//console.log(foundAttr);
						//foundAttr = foundAttr.split(":-:");
						//var dataAttribute = 'data-attribute="'+foundAttr[2]+'"';
						var dataAttribute = '';
					} else {
						var dataAttribute = '';
					}
					// ###############################################################################
					

					if(value['Choices'][i]['Text'] != "Not Selected" && index != "ELEVATION") {
						if(index == "GARAGE" && value['Choices'][i]['Enabled']) {
							var appendContent = '\
								<div class="checkbox form-input">\
								'+value['Choices'][i]['Text']+'\
									<label class="text-wrapper-label switch">\
										\
										<input id="'+class_prefix_final+'" class="amenities-input feature-input" '+dataAttribute+'  type="checkbox" '+checkedValue+' data-floors="'+arrayData[0]+'" data-toggle="toggle" data-size="small" value="'+inputVal+'">\
										<div class="slider round"></div>\
									</label>\
								</div>';

							$('#column-garage .group-selections').append(appendContent);
						} else {
							if(value['Choices'][i]['Enabled']) {
								var appendContent = '\
									<div class="checkbox form-input">\
									'+value['Choices'][i]['Text']+'\
										<label class="text-wrapper-label switch">\
											\
											<input id="'+class_prefix_final+'" class="amenities-input feature-input" '+dataAttribute+'  type="checkbox" '+checkedValue+' data-floors="'+arrayData[0]+'" data-toggle="toggle" data-size="small" value="'+inputVal+'">\
											<div class="slider round"></div>\
										</label>\
									</div>';

								$('#column-selections .group-selections').append(appendContent);
							}
							// var appendContent = '\
							// 	<div class="checkbox form-input">\
							// 	'+value['Choices'][i]['Text']+'\
							// 		<label class="text-wrapper-label switch">\
							// 			\
							// 			<input id="'+class_prefix_final+'" class="amenities-input feature-input" '+dataAttribute+'  type="checkbox" '+checkedValue+' data-floors="'+arrayData[0]+'" data-toggle="toggle" data-size="small" value="'+inputVal+'">\
							// 			<div class="slider round"></div>\
							// 		</label>\
							// 	</div>';

							// $('#column-selections .group-selections').append(appendContent);
						}

					} else if(index == "ELEVATION" && value['Choices'][i]['Enabled']) {
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
									<input id="'+class_prefix_final+'" class="amenities-input feature-input elevation-input"  '+dataAttribute+'  type="checkbox" '+checkedValue+' data-floors="'+arrayData[0]+'" data-toggle="toggle" data-size="small" value="'+inputVal+'">\
									<div class="slider round"></div>\
								</label>\
							</div>';

						var appendContent2 = '\
							<div class="checkbox form-input">\
							'+value['Choices'][i]['Text']+'\
								<label class="text-wrapper-label switch">\
									\
									<input id="'+class_prefix_final2+'" class="amenities-input elevation-input"  '+dataAttribute+' type="checkbox" '+checkedValue+' data-floors="'+arrayData[0]+'" data-toggle="toggle" data-size="small" value="'+inputVal+'">\
									<div class="slider round"></div>\
								</label>\
							</div>';
						
						//$('#column-elevations .group-selections').append(appendContent2);
						//$('#column-selections .group-selections').append(appendContent);

						$('#column-elevations .group-selections').append(appendContent);
						
					} else {
						//console.log(value['Choices'][i]['Text']);
					}

					
				}
				//$('.group-selections')append();
			} else if(index.match(lettersLower) && index in arrayList) {
				//console.log(index)
				var arrayData = arrayList[index][0];

				arrayData = arrayData.split("---");
				//console.log(arrayData);
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





				//console.log("Index " + index);

				var foundAttr = $($xml).find('svg > g[id*="'+index+'"]').attr('data-name');
				if(typeof foundAttr !== typeof undefined && foundAttr !== false) {
					//console.log(foundAttr);
					foundAttr = foundAttr.split("---");
					var dataAttribute = 'data-attribute="'+foundAttr[2]+'"';
				} else {
					var dataAttribute = '';
				}
				//console.log(dataAttribute);







				if(index != "ELEVATION") {
					var appendContent = '\
						<div class="checkbox form-input">\
						'+value['Text']+'\
							<label class="text-wrapper-label switch">\
								\
								<input id="'+value['ID']+'" class="amenities-input feature-input" '+dataAttribute+' '+dataCombined+' type="checkbox" '+checkedValue+' data-floors="'+arrayData[0]+'" data-toggle="toggle" data-size="small" value="">\
								<div class="slider round"></div>\
							</label>\
						</div>';

					$('#column-selections .group-selections').append(appendContent);

				}
			}

		});

		//$("#floor_selection_0").click();
		$('*[data-floors="_1stFloor"]').click();

		setTimeout(function() {
			loadSVG();
		}, 1000);

	};






	//var svgName = modelID + "_" + comID + ".svg";
	//var svgNameRev = modelID + "_" + comID + "_rev.svg";

	function loadSVGRev() {
		$('#svgfile').load(svgNameRev, function() {
			panZoomSVG = svgPanZoom('#Layer_1', {
				zoomEnabled: true,
         		controlIconsEnabled: false,
          		fit: true,
          		center: true,
          		mouseWheelZoomEnabled: false
			});
			updateSVG();
		});
	}


	function loadSVG() {
		$('#svgfile').load(svgName, function() {
			panZoomSVG = svgPanZoom('#Layer_1', {
				zoomEnabled: true,
         		controlIconsEnabled: false,
          		fit: true,
          		center: true,
          		mouseWheelZoomEnabled: false
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
			//console.log(floorValue)
			if($(this).is(':checked')) {
				//console.log($('g#' + floorValue));
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






			var foundAttr = $(this).attr('data-attribute');
			//console.log(foundAttr);
			//var foundAttr2 = $(this).attr('data-attribute');
			if(typeof foundAttr !== typeof undefined && foundAttr !== false) {
				//console.log($(this).attr('data-attribute'));
				if(foundAttr.match(/\+/g)) {
					var foundAttr2 = foundAttr.split("++");
					var firstID = foundAttr2[0];
					var secondID = foundAttr2[1];

					if(foundAttr.match(/FOUNDATION/gi)) {
						//console.log("foundation");
					} else {
						if($('input#' + firstID).prop('checked') == true && $('input#' + secondID).prop('checked') == true) {
							$('g.svg-pan-zoom_viewport').find('[id *="'+firstID+'---"]').css('display', "none");
							$('g.svg-pan-zoom_viewport').find('[id *="'+secondID+'---"]').css('display', "none");
							$('g.svg-pan-zoom_viewport').find('[id *="'+firstID+'_'+secondID+'"]').css('display', "block");
							//console.log($(this).attr('data-attribute'));
							//console.log($('g.svg-pan-zoom_viewport').find('[id *="'+firstID+'_'+secondID+'"]').length)
						} else if($('input#' + firstID).prop('checked') == true && $('input#' + secondID).prop('checked') == false) {
							$('g.svg-pan-zoom_viewport').find('[id *="'+firstID+'---"]').css('display', "block");
							$('g.svg-pan-zoom_viewport').find('[id *="'+secondID+'---"]').css('display', "none");
							$('g.svg-pan-zoom_viewport').find('[id *="'+firstID+'_'+secondID+'"]').css('display', "none");
							console.log("First Clicked");

						} else if($('input#' + firstID).prop('checked') == false && $('input#' + secondID).prop('checked') == true) {
							$('g.svg-pan-zoom_viewport').find('[id *="'+firstID+'---"]').css('display', "none");
							$('g.svg-pan-zoom_viewport').find('[id *="'+secondID+'---"]').css('display', "block");
							$('g.svg-pan-zoom_viewport').find('[id *="'+firstID+'_'+secondID+'"]').css('display', "none");
							console.log("Second Clicked");

						} else if($('input#' + firstID).prop('checked') == false && $('input#' + secondID).prop('checked') == false) {
							//$('g.svg-pan-zoom_viewport').find('[data-name *="'+$(this).attr('data-attribute')+'"]').css('display', "none");
							//$('g.svg-pan-zoom_viewport').find('[id *="'+firstID+':-:"]').css('display', "none");
							//$('g.svg-pan-zoom_viewport').find('[id *="'+secondID+':-:"]').css('display', "none");
							$('g.svg-pan-zoom_viewport').find('[id *="'+firstID+'_'+secondID+'"]').css('display', "none");
							$('g.svg-pan-zoom_viewport').find('[id *="'+firstID+'---"]').css('display', "none");
							$('g.svg-pan-zoom_viewport').find('[id *="'+secondID+'---"]').css('display', "none");
							//console.log("ELSE");

						}
					}

					



				} else if(foundAttr.match(/\!/g)) {
					//console.log("! in string");
				}
			} else {
				//console.log(inputValue);
				if(inputID.match(numbersearch)) {
					//var inputIDClean = inputID.replace(/\d+$/, "");
					//inputIDClean = inputIDClean.replace(/_$/,"");
					var inputIDClean = inputID;
				} else {
					var inputIDClean = inputID;
				}
				//console.log(inputIDClean)
				if($(this).is(':checked')) {
					//console.log(inputIDClean)
					//console.log("elevation");
					console.log(inputValue);
					// if(inputIDClean == "ELEVATION") {
					if(inputIDClean.match("ELEVATION")) {
						console.log("contains");
						var elevationSearch = inputValue + "---" + activeFloor;
						console.log(elevationSearch);

						$('g.svg-pan-zoom_viewport').find('> g').each(function() {
							var svgID = $(this).attr("id");
							var availFloors = svgID.split("---");
							availFloors = availFloors[1];

							if(svgID.indexOf(elevationSearch) != -1) {
								console.log("found");
								$(this).css('display', "block");
								$(this).css('color', "purple");
							} else if(svgID.indexOf("ELEVATION") != -1 && svgID.indexOf(elevationSearch) == -1) {
								$(this).css('display', "none");
							}

						});

					} else {
						if(inputValue !== "") {
							//console.log($(this).val());
							$('g.svg-pan-zoom_viewport').find('> g').each(function() {
								var svgID = $(this).attr("id");
								var availFloors = svgID.split("---");
								availFloors = availFloors[1];
								//console.log(svgID);
								if(svgID.indexOf(inputValue) != -1 && availFloors.indexOf(activeFloor) != -1) {
									//console.log(inputValue);
									var secondCheck = svgID.split("---");
									// if(svgID.indexOf("FOUNDATION") != -1) {
									if(secondCheck.length == 4) {
										//var secondCheck = svgID.split("---");
										if(secondCheck[secondCheck.length - 1] == activeFloor) {
											$(this).css('display', "block");
											$(this).css('color', "purple");
											$(this).attr('data-debug', activeFloor);
										}
									} else {
										$(this).css('display', "block");
										$(this).css('color', "purple");
										$(this).attr('data-debug', activeFloor);
									}

								} else if(svgID.indexOf(inputValue) != -1 && availFloors.indexOf('g') != -1 && activeFloor == 'f') {
									$(this).css('display', "block");
								}
							});
						} else {
							//console.log(inputValue);
							//console.log(inputIDClean);
							$('g.svg-pan-zoom_viewport').find('> g').each(function() {
								//console.log($(this).attr("id"));
								var svgID = $(this).attr("id");
								svgID = svgID.split("---");
								var availFloors = svgID[1];

								if(svgID.length > 3) {
									//console.log(inputIDClean + " " + svgID[svgID.length - 1] + " " + activeFloor + " " + svgID[0] + " " +$(this).attr("id"));
									if(svgID[0].indexOf(inputIDClean) != -1 && svgID[svgID.length - 1] == activeFloor) {
										$(this).css('display', "block");
										$(this).css('color', "black");
										alert("trigger");
									}
								} else if(svgID.length == 3) {
									console.log(inputIDClean);
									console.log(svgID[0]);
									// if(svgID[0] == inputIDClean && svgID[1].indexOf(activeFloor) != -1) {
									if(svgID[0] == inputIDClean && svgID[2].indexOf(activeFloor) != -1) {
										//console.log(inputIDClean + " " + svgID[0] + " " + activeFloor + " "  + $(this).attr("id"));
										$(this).css('display', "block");
										$(this).css('color', "black");
										$(this).attr("data-debug", activeFloor);
									}
								} else {
									//console.log(svgID[0] + " " + availFloors);
									if(svgID[0].startsWith(inputIDClean) && availFloors.indexOf(activeFloor) != -1) {
										$(this).css('display', "block");
										$(this).css('color', "black");
										$(this).attr("data-debug", activeFloor);
									}
								}
								// if(svgID[0].indexOf(inputIDClean) != -1 && svgID[svgID.length - 1] == activeFloor) {
								// 	$(this).css('display', "block");
								// 	$(this).css('color', "black");
								// }
							});
						}
					}

					
				} else {
					//console.log("ELSE TRIGGERED " + inputIDClean);
					if(inputIDClean.match("ELEVATION")) {
						console.log("match unselected elevation");
						var elevationSearch = inputValue + "---" + activeFloor;
						
						$('g.svg-pan-zoom_viewport').find('> g').each(function() {
							var svgID = $(this).attr("id");
							var availFloors = svgID.split("---");

							if(svgID.indexOf(elevationSearch) != -1) {
								$(this).css('display', "none");
								$(this).css('color', "red");
							} else {
								//$(this).css('color', "red");
							}

						});
					} else {
						if(inputValue != "") {
							$('g.svg-pan-zoom_viewport').find('> g').each(function() {
								var svgID = $(this).attr("id");

								if(svgID.indexOf("---") != -1) {
									var availFloors = svgID.split("---");
									availFloors = availFloors[1];

									if(availFloors.indexOf(activeFloor) == -1 && availFloors != "g") {
										$(this).css('display', "none");
									}
								}

								//console.log(inputValue)
								if(svgID.indexOf(inputValue) != -1) {
									$(this).css('display', "none");
									$(this).css('color', "yellow");
								}


							});
						} else {
							$('g.svg-pan-zoom_viewport').find('> g').each(function() {
								//console.log(inputValue);
								var svgID = $(this).attr("id");
								svgID = svgID.split("---");
								var availFloors = svgID[1];

								if(svgID.length == 3) {
									//console.log("Got Here");
									var subValue = svgID[2].split("-");
									//console.log(subValue[0]);
									//$(this).css('display', "none");
								}

								if(svgID[0].startsWith(inputIDClean) && availFloors.indexOf(activeFloor) != -1) {
									$(this).css('display', "none");
									$(this).css('color', "red");
									$(this).attr("data-debug", "fucked");
									//console.log(inputIDClean);
								}

								if(svgID.length > 1) {
									if(availFloors.indexOf(activeFloor) == -1) {
										$(this).css('display', "none");
									}
								}

							});
						}
					}

					
				}



			}





		});
	}







	$(document).on('click','input.amenities-input', function() {
		//console.log($(this).val())
		var currentID = $(this).attr('id');

		var inputIDClean = currentID.replace(/[0-9]/g, "");
		inputIDClean = inputIDClean.replace(/_$/,"");

		var idSearch = currentID.split("_");
		var currentValue = $(this).val();

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
					//console.log("found " + $(this).attr('id'));
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

	var allowClick = true;

	$('.toggle-options').on('click', function(event) {
		event.preventDefault();
		var selectionVal = $(this).text();
		selectionVal = selectionVal.toLowerCase();

		if(allowClick) {
			//allowClick = false;
			if($(this).parent().parent().hasClass('left-sdebar-selected')) {

			} else {
				$('div.left-sidebar').each(function() {
					if($(this).hasClass('left-sdebar-selected')) {
						$(this).removeClass('left-sdebar-selected');
					}
				});
				$(this).parent().parent().addClass('left-sdebar-selected')
			}

			allowClick = false;

			if(selectionVal == "floors") {
				//console.log();
				if($('.middle-column:visible').length == 0) {
					$('#column-floors').slideDown(function() {
						loadSVG();
						allowClick = true;
						addRemoveScroll();
					});
				} else {
					$('.middle-column:visible').fadeOut(function() {
						$('#column-floors').slideDown(function() {
							loadSVG();
							allowClick = true;
							addRemoveScroll();
						});
						//loadSVG();
					});
				}


				// if($('.middle-column:visible') == 0) {

				// } else {
					
				// }
				// $('.middle-column:visible').slideUp(function() {
				// 	$('#column-floors').slideDown(function() {
				// 		loadSVG();
				// 		allowClick = true;
				// 		addRemoveScroll();
				// 	});
				// 	//loadSVG();
				// });
				
			} else if(selectionVal == "selections") {
				//console.log("selections");
				if($('.middle-column:visible').length == 0) {
					console.log('middle column 0')
					$('#column-selections').slideDown(function() {
						loadSVG();
						allowClick = true;
						addRemoveScroll();
					});
				} else {
					$('.middle-column:visible').fadeOut(function() {
						$('#column-selections').slideDown(function() {
							loadSVG();
							allowClick = true;
							addRemoveScroll();
						});
						//loadSVG();
					});
				}



				// $('.middle-column:visible').slideUp(function() {
				// 	$('#column-selections').slideDown(function() {
				// 		loadSVG();
				// 		allowClick = true;
				// 		addRemoveScroll();
				// 	});
				// 	//loadSVG();
				// });
				
			} else if(selectionVal == "furniture") {
				$('.middle-column:visible').fadeOut(function() {
				});

			} else if(selectionVal == "garage") {
				if($('.middle-column:visible').length == 0) {
					$('#column-garage').slideDown(function() {
						loadSVG();
						allowClick = true;
						addRemoveScroll();
					});
				} else {
					$('.middle-column:visible').fadeOut(function() {
						$('#column-garage').slideDown(function() {
							loadSVG();
							allowClick = true;
							addRemoveScroll();
						});
						//loadSVG();
					});
				}



				// $('.middle-column:visible').slideUp(function() {
				// 	$('#column-garage').slideDown(function() {
				// 		loadSVG();
				// 		allowClick = true;
				// 		addRemoveScroll();
				// 	});
				// 	//loadSVG();
				// });

			} else if(selectionVal == "elevations") {
				if($('.middle-column:visible').length == 0) {
					$('#column-elevations').slideDown(function() {
						var elevImagePath = elevPath + $('#column-elevations').find('input:checked').val() + ".jpg";
						$('#svgfile').html("<img src='"+elevImagePath+"' class='img-responsive' />");
						//loadSVG();
						allowClick = true;
						addRemoveScroll();
					});
				} else {
					$('.middle-column:visible').fadeOut(function() {
						$('#column-elevations').slideDown(function() {
							var elevImagePath = elevPath + $('#column-elevations').find('input:checked').val() + ".jpg";
							$('#svgfile').html("<img src='"+elevImagePath+"' class='img-responsive' />");
							//loadSVG();
							allowClick = true;
							addRemoveScroll();
						});
						//loadSVG();
					});
				}





				// $('.middle-column:visible').slideUp(function() {
				// 	$('#column-elevations').slideDown(function() {
				// 		var elevImagePath = elevPath + $('#column-elevations').find('input:checked').val() + ".jpg";

				// 		//$('#column-elevations').find('input:checked').val()
				// 		$('#svgfile').html("<img src='"+elevImagePath+"' class='img-responsive' />");
				// 	});
				// 	allowClick = true;
				// 	addRemoveScroll();
				// 	//var elevImagePath = elevPath + $('#column-elevations').find('input:checked').val() + ".jpg";

				// 	//$('#column-elevations').find('input:checked').val()
				// 	//$('#svgfile').html("<img src='"+elevImagePath+"' class='img-responsive' />");
				// });
				
			}


		} else {

		}

		//allowClick = true;
	});

	$('a.zoom-icons').on('click', function(event) {
		event.preventDefault();
		if($(this).children('img').attr('src') == "images/zoomin.png") {
			panZoomSVG.zoomIn();
		} else if($(this).children('img').attr('src') == "images/zoomout.png") {
			panZoomSVG.zoomOut();
		}
	});
	
	$('span.close-options  a').on('click', function(event) {
		event.preventDefault();
		var testID = $(this).parent().parent().parent().parent().parent().attr('id');
		//console.log(testID);

		if(typeof testID !== "undefined") {
			$(this).parent().parent().parent().parent().parent().slideUp();
		} else {
			$(this).parent().parent().parent().parent().slideUp();
		}
		//$(this).parent().parent().parent().parent().parent().slideUp();
	});

});


























