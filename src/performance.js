(function() {
	var getPerf = function() {
		var result = {},
		performance, navigation, timing, val, t;
		result.timeStamp = new Date();
		result.userAgent = navigator.userAgent;
		result.URL = location.href;
		if (!window.performance) {
			result.status = "Performance interface is undefined.";
			result.isCache = "undefined";
			result.navigationType = "undefined";
			result.redirectCount = "undefined";
			result.redirectTime = 'undefined <em data-start="redirectStart" data-end="redirectEnd">( redirectStart -> redirectEnd )</em>';
			result.domainLookupTime = 'undefined <em data-start="domainLookupStart" data-end="domainLookupEnd">( domainLookupStart -> domainLookupEnd )</em>';
			result.connectTime = 'undefined <em data-start="connectStart" data-end="connectEnd">( connectStart -> connectEnd )</em>';
			result.requestTime = 'undefined <em data-start="requestStart" data-end="responseStart">( requestStart -> responseStart)<em>';
			result.responseTime = 'undefined <em data-start="responseStart" data-end="responseEnd">( responseStart -> responseEnd )</em>';
			result.domParsingTime = 'undefined <em data-start="domLoading" data-end="domInteractive">( domLoading -> domInteractive )</em>';
			result.resourcesLoadedTime = 'undefined <em data-start="domLoading" data-end="loadEventStart">( domLoading -> loadEventStart )</em>';
			result.domContentLoadedTime = 'undefined <em data-start="fetchStart" data-end="domContentLoaded">( fetchStart -> domContentLoadedEventStart )</em>';
			result.windowLoadedTime = 'undefined <em data-start="fetchStart" data-end="loadEventStart">( fetchStart -> loadEventStart )</em>';
		} else {
			result.status = "Available";
			performance = window.performance;
			navigation = performance.navigation;
			timing = performance.timing;
			result.isCache = function() {
				if (navigation.type === 1) {
					return false;
				}
				if (timing.requestStart === 0) {
					return true;
				}
				if (timing.connectStart === timing.connectEnd) {
					//Freifox8+,Chrome11+,IE9+
					return true;
				}
				return false;
			} ();
			result.navigationType = function(t) {
				return ["normal get or link", "reload", "back forward", "reserved"][t];
			} (navigation.type);
			result.redirectCount = navigation.redirectCount;
			result.redirectTime = timing.redirectEnd - timing.redirectStart + ' <em data-start="redirectStart" data-end="redirectEnd">( redirectStart -> redirectEnd )</em>';
			result.domainLookupTime = timing.domainLookupEnd - timing.domainLookupStart + ' <em data-start="domainLookupStart" data-end="domainLookupEnd">( domainLookupStart -> domainLookupEnd )</em>';
			result.connectTime = timing.connectEnd - timing.connectStart + ' <em data-start="connectStart" data-end="connectEnd">( connectStart -> connectEnd )</em>';
			result.requestTime = timing.responseStart - (timing.requestStart || timing.responseStart + 1) + ' <em data-start="requestStart" data-end="responseStart">( requestStart -> responseStart)<em>';
			result.responseTime = function() {
				val = timing.responseEnd - timing.responseStart;
				if (timing.domContentLoadedEventStart) {
					if (val < 0) {
						val = 0;
					}
				} else {
					val = "not support";
				}
				return val + ' <em data-start="responseStart" data-end="responseEnd">( responseStart -> responseEnd )</em>';
			} ();
			result.domParsingTime = function() {
				t = ' <em data-start="domLoading" data-end="domInteractive">( domLoading -> domInteractive )</em>';
				return timing.domContentLoadedEventStart ? timing.domInteractive - timing.domLoading + t: "not support" + t;
			} ();
			result.resourcesLoadedTime = function() {
				t = ' <em data-start="domLoading" data-end="loadEventStart">( domLoading -> loadEventStart )</em>';
				return timing.loadEventStart ? timing.loadEventStart - timing.domLoading + t: "not support" + t;
			} ();
			result.domContentLoadedTime = function() {
				t = ' <em data-start="fetchStart" data-end="domContentLoaded">( fetchStart -> domContentLoadedEventStart )</em>';
				return timing.domContentLoadedEventStart ? timing.domContentLoadedEventStart - timing.fetchStart + t: "not support" + t;
			} ();
			result.windowLoadedTime = function() {
				t = ' <em data-start="fetchStart" data-end="loadEventStart">( fetchStart -> loadEventStart )</em>';
				return timing.loadEventStart ? timing.loadEventStart - timing.fetchStart + t: "not support" + t;
			} ();
		}
		return result;
	};

	var render = function(paper_id) {
		var canvas = Raphael(document.getElementById(paper_id), 880, 450),
		rectHeight = 50,
		rectY = 220,
		textY = rectY + rectHeight / 2,
		topTextX = 280,
		topTextY = 10,
		textAttr = {
			"font-size": "12px"
		},
		rectAttr = {
			stroke: "#369",
			"stroke-width": 1.5
		},
		list = {};
		canvas.rect(10, rectY, 70, rectHeight).attr(rectAttr);
		canvas.text(45, textY, "Prompt\nfor\nunload").attr(textAttr);
		canvas.rect(85, rectY, 90, rectHeight).attr(rectAttr);
		canvas.text(130, textY, "redirect").attr(textAttr);
		canvas.rect(180, rectY, 60, rectHeight).attr(rectAttr);
		canvas.text(210, textY, "App\ncache").attr(textAttr);
		canvas.rect(245, rectY, 60, rectHeight).attr(rectAttr);
		canvas.text(275, textY, "DNS").attr(textAttr);
		canvas.rect(310, rectY, 60, rectHeight).attr(rectAttr);
		canvas.text(340, textY, "TCP").attr(textAttr);
		canvas.rect(375, rectY, 120, rectHeight).attr(rectAttr);
		canvas.text(435, textY, "Request").attr(textAttr);
		canvas.rect(495, rectY, 120, rectHeight).attr(rectAttr);
		canvas.text(555, textY, "Response").attr(textAttr);
		canvas.rect(620, rectY, 150, rectHeight).attr(rectAttr);
		canvas.text(695, textY, "Processing").attr(textAttr);
		canvas.rect(770, rectY, 100, rectHeight).attr(rectAttr);
		canvas.text(820, textY, "onload").attr(textAttr);
		canvas.rect(90, rectY + 45, 70, rectHeight).attr({
			stroke: "#369",
			"stroke-width": "2",
			fill: "#fff"
		});
		canvas.text(125, textY + 20 + rectHeight / 2, "unload").attr(textAttr);
		var eventGroup = {};
		eventGroup.canvas = canvas;
		eventGroup.navigationStart = {
			x: 80,
			line: canvas.path("M82,217 L210,10 L230,10").attr(rectAttr),
			text: canvas.text(280, 10, "navigationStart").attr(textAttr)
		};
		eventGroup.redirectStart = {
			x: 85,
			line: canvas.path("M87,217 L250,25 L290,25").attr(rectAttr),
			text: canvas.text(330, 25, "redirectStart").attr(textAttr)
		};
		eventGroup.redirectEnd = {
			x: 175,
			line: canvas.path("M177,217 L270,40 L320,40").attr(rectAttr),
			text: canvas.text(360, 40, "redirectEnd").attr(textAttr)
		};
		eventGroup.fetchStart = {
			x: 180,
			text: canvas.text(390, 55, "fetchStart").attr(textAttr),
			line: canvas.path("M182,217 L320,55 L355,55").attr(rectAttr)
		};
		eventGroup.domainLookupStart = {
			x: 245,
			text: canvas.text(420, 70, "domainLookupStart").attr(textAttr),
			line: canvas.path("M247,217 L340,70 L355,70").attr(rectAttr)
		};
		eventGroup.domainLookupEnd = {
			x: 305,
			text: canvas.text(450, 85, "domainLookupEnd").attr(textAttr),
			line: canvas.path("M307,217 L380,85 L390,85").attr(rectAttr)
		};
		eventGroup.connectStart = {
			x: 310,
			text: canvas.text(480, 100, "connectStart").attr(textAttr),
			line: canvas.path("M312,217 L400,100 L440,100").attr(rectAttr)
		};
		eventGroup.secureConnectionStart = {
			x: 340,
			text: canvas.text(510, 115, "secureConnectionStart").attr(textAttr),
			line: canvas.path("M342,217 L420,115 L445,115").attr(rectAttr)
		};
		eventGroup.connectEnd = {
			x: 370,
			text: canvas.text(540, 130, "connectEnd").attr(textAttr),
			line: canvas.path("M372,217 L450,130 L500,130").attr(rectAttr)
		};
		eventGroup.requestStart = {
			x: 375,
			text: canvas.text(570, 145, "requestStart").attr(textAttr),
			line: canvas.path("M377,217 L500,145 L530,145").attr(rectAttr)
		};
		eventGroup.responseStart = {
			x: 495,
			text: canvas.text(600, 160, "responseStart").attr(textAttr),
			line: canvas.path("M497,217 L520,160 L555,160").attr(rectAttr)
		};
		eventGroup.responseEnd = {
			x: 615,
			text: canvas.text(700, 175, "responseEnd").attr(textAttr),
			line: canvas.path("M617,217 L630,175 L655,175").attr(rectAttr)
		};
		eventGroup.unloadStart = {
			x: 90,
			text: canvas.text(630, 430, "unloadStart").attr(textAttr),
			line: canvas.path("M92,318 L430,430 L590,430").attr(rectAttr)
		};
		eventGroup.unloadEnd = {
			x: 162,
			text: canvas.text(660, 415, "unloadEnd").attr(textAttr),
			line: canvas.path("M162,318 L440,415 L620,415").attr(rectAttr)
		};
		eventGroup.domLoading = {
			x: 620,
			text: canvas.text(690, 400, "domLoading").attr(textAttr),
			line: canvas.path("M621,274 L630,400 L650,400").attr(rectAttr)
		};
		eventGroup.domInteractive = {
			x: 660,
			text: canvas.text(720, 385, "domInteractive").attr(textAttr),
			line: canvas.path("M661,274 L662,385 L675,385").attr(rectAttr)
		};
		eventGroup.domContentLoaded = {
			x: 705,
			text: canvas.text(760, 370, "domContentLoaded").attr(textAttr),
			line: canvas.path("M705,274 L685,370 L701,370").attr(rectAttr)
		};
		eventGroup.domComplete = {
			x: 760,
			text: canvas.text(810, 355, "domComplete").attr(textAttr),
			line: canvas.path("M761,274 L750,355 L767,355").attr(rectAttr)
		};
		eventGroup.loadEventStart = {
			x: 770,
			text: canvas.text(820, 340, "loadEventStart").attr(textAttr),
			line: canvas.path("M771,274 L772,340 L777,340").attr(rectAttr)
		};
		eventGroup.loadEventEnd = {
			x: 870,
			text: canvas.text(840, 325, "loadEventEnd").attr(textAttr),
			line: canvas.path("M870,274 L855,315").attr(rectAttr)
		};
		return eventGroup;
	};

	window.addEventListener('load', function() {

		var openChartBtn = $('<a style="position:fixed;bottom:2px;left:2px;font-size:12px;color:#08c" href="javascript:;">查看当前页面链路性能</a>');

		openChartBtn.appendTo('body').click(function() {
			var perfWindow = window.open('about:blank', "_blank", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=950, height=800");

/*
			var result = getPerf(),
			k,
			d,
			ds,
			de,
			dt,
			color = "#ff0",
			dataShowBox = $("#dataShowBox"),
			eventGroup;
			for (k in result) {
				dataShowBox.append('<p class="ovl" id="' + k + '"><b class="mr20 blk tr fl" style="width:190px">' + k + '：</b><span class="blk fl" style="color:#08c;width:670px;overflow:hidden;word-wrap:break-word; word-break:break-all">' + result[k] + "</span></p>");
				if (k == "redirectCount") {
					dataShowBox.append('<div class="mt10 mb10" style="border-top:1px solid #ddd" />');
				}
				if (k == 'windowLoadedTime') {
					dataShowBox.append('<div id="paper" class="mt10 mb10" style="border:1px solid #ddd;border-left:0;border-right:0;background:#fff"></div>');
					eventGroup = render("paper");
				}
			}
			dataShowBox.find("p:gt(6)").css("cursor", "pointer").end().on("mouseover", "p", function() {
				if ($(this).index() < 7) {
					return;
				}
				$(this).css("background", "yellow");
				$.each(eventGroup, function(k, v) {
					if (k == "canvas") {
						return;
					}
					v.line.attr("stroke-opacity", "0.1");
					v.text.attr("opacity", "0.1");
				});
				d = $(this).find("em");
				ds = eventGroup[d.attr("data-start")];
				de = eventGroup[d.attr("data-end")];
				ds.line.attr("stroke-opacity", "");
				ds.text.attr("opacity", "");
				de.line.attr("stroke-opacity", "");
				de.text.attr("opacity", "");
				dt = eventGroup.canvas.rect(ds.x, 220, de.x - ds.x, 50).attr({
					fill: "yellow",
					opacity: "0.5",
					stroke: ""
				});
				console.log(ds);
			}).on("mouseout", "p", function() {
				if ($(this).index() < 7) {
					return;
				}
				$("p").css("background", "");
				dt.remove();
				$.each(eventGroup, function(k, v) {
					if (k == "canvas") return;
					v.line.attr("stroke-opacity", "");
					v.text.attr("opacity", "");
				});
			});
*/

		});

	},
	false);

	/*

	window.onload = function() {

	};
  */

})();

