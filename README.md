# Yotube MultiPlayer Application

This application allows users to play the same video
among multiple platforms while synchronizing the videos
from the server so they all play at the same exact time.

![Gif of UI](https://github.com/Kalatco/YouTubeMultiPlay/blob/master/gif1.gif)

## Author

Andrew Raftovich, Summer 2019.

## Usage

#### Video
The Video player has very limited controls to the user
only allowing them to click the video title and view the
video creator's page.

The app does not allow users to skip through the video 
because it is designed to run the video at the same time as
other users.

#### Queue
The queue shows the thumbnails for all the queued videos.

![Gif of queue](https://github.com/Kalatco/YouTubeMultiPlay/blob/master/gif2.gif)

#### Remaining Time
The remaining timer shows a sliding DIV element inside of a parent
DIV to display how much of the video has been played and once 
the DIV element reaches the end of the parent DIV, if there is
another video in queue, the DIV element will reset.

#### Skip Button
The skip button works by skipping the current video once 50% 
of the users have clicked the button. A user can unvote by 
clicking the button after voting.

#### Video Link Input
Users can add as many videos as they like, as long as the
video is available on YouTube.com.

## Dependencies

Node.jS, Express, Node-fetch, & Socket.io.

## Starting the server

To run this app, you must run the NodeMon package by 
simply typing:
```bash
nodemon index.html
```
This will run the index.js file and start the server.

## API key

You will need to get your own free API key from YouTube to use this
application.

You can get your own key by following the instructions in this link:
[YouTube API](https://developers.google.com/youtube/v3/getting-started)

Once you have recieved the key you must insert it inside the VideoList.js
file located inside the VideoActions folder.
```python
const API_KEY = "{INSERT KEY HERE}";
````

