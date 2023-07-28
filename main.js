// ==UserScript==
// @name         Shortcut for next episode hidive
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.hidive.com/stream/*
// ==/UserScript==

(function() {
    'use strict';
    var xpath = function (xpathToExecute) {
        var result = [];
        var nodesSnapshot = document.evaluate(xpathToExecute, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
            result.push(nodesSnapshot.snapshotItem(i));
        }
        return result;
    };

    function getEpisodelink(episodeNumber,episodePrefix){
        const episodeAlt=episodePrefix + " " +episodeNumber;
        const nextEpisodeNode = xpath(
            `//img[@alt="${episodeAlt}"]/ancestor::div[@style="position:relative;"]/div/div/a`,
        );
        const episodeURLSuffix = nextEpisodeNode[0]['attributes']["data-playurl"]["nodeValue"];
        const base = 'https://www.hidive.com';
        return base + episodeURLSuffix;
    };
    // Handle arrow key events
 	function attachArrowKeyEvent()
 	{
        const currEpisodeNode = xpath(
            "//div/div[@class= 'hitbox currentEpisode']/following-sibling::div/img"
        )[0];
        const currEpisodeText = currEpisodeNode['alt'].split(" ");
        const currEpisode = parseInt(currEpisodeText.pop(),10);
        const currEpisodePrefix = currEpisodeText.join(" ");
        const nextEpisode = currEpisode + 1
        const prevEpisode = currEpisode - 1

        const nextUrl = getEpisodelink(nextEpisode,currEpisodePrefix);
        const prevUrl = getEpisodelink(prevEpisode,currEpisodePrefix);

 		document.onkeydown = function(evt) {
			switch (evt.keyCode) {
				case 17 && 37: // ctrl + Left Arrow
					window.open(prevUrl,"_self");
					break;
				case 17 && 39: // ctrl + Right Arrow
					window.open(nextUrl,"_self");
					break;
			}
		};
 	};
    $(document).ready(function()
 	{
 		attachArrowKeyEvent();
	});
})();
