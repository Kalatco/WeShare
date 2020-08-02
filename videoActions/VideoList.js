/*
	File: VideoList.js
	Author: Andrew Raftovich, 2019

	About: Holds information about videos being played and their lengths. Automatically Finds
		   the length of the video given the video ID. 
*/
const config = require('config');
const fetch = require('node-fetch');
const API_KEY = config.get('Youtube.api_key');
const API_LINK = config.get('Youtube.api_url');
const SEARCH_TYPE = config.get('Youtube.api_search_type');

class YoutubeVideoList {
	constructor() {
		this.videoList = [];
	}
	
	/*
		About: Using the video ID, finds the length of the video using the youtube/v3 api
			   and adds the ID and video length to a list, otherwise ignore the ID if it
			   returns unknown.
	*/
	addVideo(videoLink) {
		const videoID = getYoutTubeID(videoLink)
		fetch(`${API_LINK}${SEARCH_TYPE}&id=${videoID}&key=${API_KEY}`)
			.then((res) => {
				return res.json();
			})
			.then((res) => {
				const defaultArt = res.items[0].snippet.thumbnails.default.url;
				let standardArt = null;
				try {
					standardArt = res.items[0].snippet.thumbnails.standard.url;
				} catch(error) {
					console.log("Unknown Image");
				}
				this.videoList.push({
						id: videoID,
						length: convertToSeconds(res.items[0].contentDetails.duration),
						videoArt: Object.is(standardArt, null) ? defaultArt : standardArt,
					});
			})
			.catch((err) => {
				console.log(err);
			})
	}

	/*
		About: Gets the next video and deletes it form the list, or null response.
	*/
	getNext() {
		if(this.videoList.length > 0) {
			return this.videoList.shift();
		} else {
			return null;
		}	
	}

	/*
		About: Returns a list of all the videos and their length.
	*/
	getList() {
		return this.videoList;
	}
}

module.exports = YoutubeVideoList;

/*
	About: Takes a youtube link and pulls out the video ID from the link.
*/
function getYoutTubeID(url){
   url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
   return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
}


/*
	About: Converts the Youtube standard "PT00H00M00S" length format to seconds as an Integer.
*/
function convertToSeconds(duration) {
	let a = duration.match(/\d+/g);

    if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
        a = [0, a[0], 0];
    }

    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
        a = [a[0], 0, a[1]];
    }
    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
        a = [a[0], 0, 0];
    }

    duration = 0;

    if (a.length == 3) {
        duration = duration + parseInt(a[0]) * 3600;
        duration = duration + parseInt(a[1]) * 60;
        duration = duration + parseInt(a[2]);
    }

    if (a.length == 2) {
        duration = duration + parseInt(a[0]) * 60;
        duration = duration + parseInt(a[1]);
    }

    if (a.length == 1) {
        duration = duration + parseInt(a[0]);
    }
    return duration;
}