/*
	File: RunVideo.js
	Author: Andrew Raftovich, 2019

	About: Takes a YoutTube video link and adds it to a list that converts it to an ID, video length, and video
		   banner art.  If there is no current video in the queue, play this video, otherwise play it when the
		   queue reaches this link.  Also sends the current server time to the client to align the videos together
		   so all clients have the same video playing at the same time.
*/
const VideoList = require('./VideoList.js');
const sleep = (s) => new Promise((resolve, reject)=> setTimeout(resolve, s * 1000));

class RunVideo {
	
	constructor(socketObj) {
		this.mySock = socketObj
		this.myList = new VideoList();

		this.isRunning = false;
		this.curId = '';
		this.curTime = 0;
		this.videoLength = 0;

		this.currentUsers = 0;
		this.skipVideoVote = 0;
		this.skipVideoBool = false;
	}

	/*
		About: Adds the video to the VideoList object and checks if a video is currently running, otherwise
		play this video.
	*/
	async addVideo(id) {
		this.myList.addVideo(id);

		if(this.isRunning == false) {
			await sleep(1);
			this.isRunning = true;
			this.runProgram();
		}
		await sleep(2)
		this.mySock.emit('updateQueue', { queueList: this.getList() });
	}

	/*
		About: Runs asynchronously so the function can create a running timer of the current video time and
			   update clients that are not running at the same time.  Also sends the next video when the current
			   video ends, until there are no more videos in the queue.
	*/
	async runProgram() {
		
		while(this.isRunning) {
			const nextQueueItem = this.myList.getNext();
			if(nextQueueItem !== null) {
				this.curId = nextQueueItem.id
				this.videoLength = nextQueueItem.length;
				this.curTime = 0;

				this.mySock.emit('nextVideo', {
						video: this.getVideoId(),
						queueList: this.getList(),
					});
				
				while (this.curTime < this.videoLength && !this.skipVideoBool) {

					await sleep(1)
					this.curTime++;
					this.mySock.emit('remainingTimePercent', {
							percentRemaining: (this.curTime/this.videoLength*100),
							time: this.curTime,
						});
				}
				this.skipVideoBool = false;
			}
			this.curId = '';
			if(!(this.myList.getList().length > 0)) {
					this.isRunning = false;
			}
		}
	}

	/*
		About: Ends the current video that is playing and skips to the next one.
	*/
	async skipVideo() {
		this.skipVideoVote++;
		this.sendVoteUpdate();

		if(this.skipVideoVote >= this.currentUsers/2) {
			await sleep(1);
			this.skipVideoBool = true;
			this.skipVideoVote = 0;
			
			this.sendVoteUpdate();
			if(this.getList.length > 0) {
				this.runProgram();
			} else if (this.curId !== ''){
				await sleep(1);
				this.mySock.emit('noMoreVideos', { time: this.videoLength-1 });
			}
		}
	}

	/*
		About:
	*/
	//Makes a call to the client to update the voting status.
	sendVoteUpdate() {
		this.mySock.emit('userSkipButtonUpdate', {
				skips: this.skipVideoVote,
				total: this.currentUsers
			});
	}

	//Updates voting information.
	addUser() {
		this.currentUsers++;
		this.sendVoteUpdate();
	}

	removeUser() {
		this.currentUsers--;
		this.sendVoteUpdate();
	}

	cancelVote() {
		this.skipVideoVote--;
		this.sendVoteUpdate();
	}

	//Public getters.
	getList() {
		return this.myList.getList();
	}

	getCurrentTime() {
		return this.curTime;
	}

	getEndTime() {
		return this.videoLength;
	}

	getVideoId() {
		return this.curId;
	}
}

module.exports = RunVideo;