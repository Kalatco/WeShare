/*
	File: Index.js
	Author: Andrew Raftovich, 2019

	About: Backend server for a youtube play server that allows crossplay of
		   the same video, allowing users to vote skip, and choose next videos
		   where all sites host the same video in real time.

	Package dependencies: Node.JS, Express.JS, & Socket.io.

	Port: localHost:5000
*/

const express = require('express');
const app = express();
const server = app.listen( process.env.PORT || 5000 );
const io = require('socket.io').listen(server);

const RunVideo = require('./videoActions/RunVideo.js')
const myVideoRunner = new RunVideo(io);

app.use(express.static(__dirname + '/site'));

io.on('connection', (socket) => {
	myVideoRunner.addUser();

	socket.emit('currentVideo', {
			video: myVideoRunner.getVideoId(), 
			currentTime: myVideoRunner.getCurrentTime(),
			endTime: myVideoRunner.getEndTime(),
			queueList: myVideoRunner.getList(),
		});
   
  socket.on('addVideo', (data) => { myVideoRunner.addVideo(data.video); });

  socket.on('disconnect', () => { myVideoRunner.removeUser(); });

	socket.on('userWantsSkip', () => { myVideoRunner.skipVideo(); });

	socket.on('userCancelsSkip', () => { myVideoRunner.cancelVote(); });
});	
