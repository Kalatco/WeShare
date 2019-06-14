/*
	File: script.js
	Author: Andrew Raftovich, 2019
*/

//Variable declarations
const socket = io();
var videoID, videoStart, videoList;
var player;
var playerDefined = false;
var timesDelayed = 0;
var userVotedToSkip = false;
var videoIsPlaying = false;


/*-----------------SOCKET.IO CONNECTIONS--------------------*/

/*
	About: Upon connection to the website, send the user the current
	       video playing along with other useful data, if there is one.
*/
socket.on('currentVideo', (data) => {
		videoID = data.video,
		videoStart = data.currentTime,
		videoList = data.queueList
});

/*
	About: When the current video ends, send the user the next video in queue.
*/
socket.on('nextVideo', (data) => {
	player.loadVideoById(data.video, 0.5, "large");
	player.playVideo();
	updateQueueList(data.queueList);
	timesDelayed = 0;
	videoIsPlaying = true;
	userVotedToSkip = false;
	$('#skip').val("vote skip");
});


/*--------------------JQUERY ACTIONS------------------------*/

$('document').ready(() => {
	const $mute = $('#muteButton');
	const $skip = $('#skip');
	const $link = $('#link');
	const linkBoxValue = "(YouTube link)";

	//Gives the user link input box an easily changable filler.
	$link.val(linkBoxValue);

	/*
		About: Sends the server a new video user wants to add to queue.
	*/
	$('#myForm').on('submit', (e) => {
		e.preventDefault();
		var myVideo = $link.val();
		if(myVideo != '' && myVideo != linkBoxValue) {
			console.log(myVideo)
			socket.emit('addVideo', { video: myVideo });
			$link.val(linkBoxValue);
		}
	});

	/*
		About: Clears the video link input box so user can type the link.
	*/
	$link.on('click', () => {
		if ($link.val() === linkBoxValue) {
			$link.val("");
		}
	});
	
	/*
		About: Mutes and unmutes the video while also updating the button values.
	*/	
	$mute.on('click', () => {
					
		if($mute.val() == 'mute') {
			player.mute();
			$mute.val('unmute');
		} else {
			player.unMute();
			$mute.val('mute');
		}
	});

	/*
		About: Tells the server the user wants to skip the video.
	*/
	$skip.on('click', (e) => {
		e.preventDefault();
		if(!userVotedToSkip && videoIsPlaying) {
			socket.emit('userWantsSkip');
			userVotedToSkip = true;
		} else if (videoIsPlaying) {
			userVotedToSkip = false;
			socket.emit('userCancelsSkip');
		}
	});

	/*
		About: Updates the skip button to display how many users want to skip out of total users.
	*/
	socket.on('userSkipButtonUpdate', (data) => {
		const count = data.skips;
		const totalUsers = data.total;
		if(count > 0) {
			$skip.val(`${count}/${totalUsers} Voted skip`)
		} else if($skip.val() != "vote skip") {
			$skip.val("vote skip");
		}
	});

	/*
		About: Call from the server to update the remining time bar to a certain percentage and restarts
		       when a new video plays.
	*/
	socket.on('remainingTimePercent', (data) => {
		setRemainingPercent(data.percentRemaining);
		checkDelay(data.time)
	});

	/*
		About: Call from the server to update the Queue list.
	*/
	socket.on('updateQueue', (data) => {
		console.log('updatting queue: ' + data.queueList)
		updateQueueList(data.queueList);
	});

	/*
		About: Users chose to skip the current video, but no more videos exist, so skip to the end of the 
			   current video.
	*/
	socket.on('noMoreVideos', (data) => {
		player.seekTo(data.time);
		setRemainingPercent(100);
	});
});


/*-----------------------CALLABLE FUNCTIONS--------------------*/

/*
	About: Clears the existing queue div and replaces it with an updated list of queued videos
		   along with the video duration and thumbnail for the video.
*/
function updateQueueList(jsonData) {
	var $queue = $('#queue');
	var queueString = "";
	var old_seconds = 0;

	if(jsonData.length > 0) {
		$queue.empty();
		for(data in jsonData) {
			convertDataToQueue(jsonData[data].length, jsonData[data].videoArt);
		}
	} else if ($queue.find("img").length > 0) {
		$queue.empty();
		$queue.append('<p>End of Queue..</p>');
	}
}

/*
	About: Converts a given amount of time in seconds into a more formatted time in hours, minutes,
		   and seconds and outputs that data onto the #Queue DIV along with a user provided image.
*/
function convertDataToQueue(time, image) {
	var queueString = `<div class="photo"><img src="${image}"><div class="btm-rt">`;
	const hours = Math.floor(time / 3600);
	const minutes = Math.floor((time - (hours * 3600)) / 60);
    const seconds = time - (hours * 3600) - (minutes * 60);

	if (hours >= 1) {
		queueString += `${hours}H ${minutes}M`;
	} else if (minutes > 1) {
		queueString += `${minutes}M ${seconds}S`;
	} else {
		queueString += `${seconds}S`;
	}
	queueString += "</div></div>"
	$('#queue').append(queueString);
}

/*
	About:  If the video is delayed by more than 0.2 seconds than the server, update the user video time,
			but after 6 attempts of fixing the video, stop fixing the video.
*/
function checkDelay(serverTime) {

	if(typeof player !== null && playerDefined && (timesDelayed < 9)) {
		timesDelayed++;
		var playerTime = player.getCurrentTime();

		if(serverTime-0.2 > playerTime || serverTime+0.2 < playerTime) {
			console.log('fixing video delay, video lag may occur')
				player.seekTo(serverTime)
		}
	}
}

/*
	About: Updates the remaining time div to show the user how much more time until the video is over.
*/
function setRemainingPercent(percentage) {
	$('#timeSlider').animate({'width': `${percentage}%`});
}


/*-------------------YOUTUBE IFRAME PLAYER CODE-------------------*/
 
// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '92%',
		width: '99.8%',
		playerVars: {
       		controls: '0',
       		mute: '1',
       		playsinline: '1' /* Added for mobile use. does it work? */
      	},
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	if(videoID !== "") {
		event.target.loadVideoById(videoID, videoStart, "large");
		videoIsPlaying = true;
	}
	updateQueueList(videoList);
	playerDefined = true;
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.		
function onPlayerStateChange(event) {
	if(event.data == YT.PlayerState.PAUSED) {
		event.target.playVideo();
		videoIsPlaying = true;
	}

	if(event.data == 0) {
		videoIsPlaying = false;
	}
}