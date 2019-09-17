# WeShare

This application Allows users to stream videos with their friends from different computers without the trouble of having each person sychronize 
and search for the videos they want to play. This program does all the 
work for you by having one person type the video link into the program.

![Gif of UI](https://github.com/Kalatco/YouTubeMultiPlay/blob/master/gif1.gif)

## Author

Andrew Raftovich, Summer 2019.

## Usage

#### Video
The YouTube player itself has limited controls for the user 
which only allows them to view the video title and the content 
creator's page.

The app does not allow users to skip through the video because 
it is designed to run the video at the same time stamp as other 
users also on the page.

#### Queue
The queue gives users access to see the next video playing and
the length of the queued videos.

![Gif of queue](https://github.com/Kalatco/YouTubeMultiPlay/blob/master/gif2.gif)

#### Skip Button
The skip button works by skipping the current video once 50% 
of the users on the website have clicked the button. 

A user can also revoke their vote by clicking the button again.

#### Video Link Input
Users can add as many videos as they would like to the queue, as 
long as the video is available on YouTube.com.

## Dependencies

Node.jS, Express, Node-fetch, & Socket.io.

## Starting the server

To run this app, you must make sure all the files are installed and go to the directory of the file in the terminal and type the following command:
```bash
nodemon index.js
```
This command will start the server and you can access the site from the website 'localhost:5000' in your web browser.

## API key

You will need to get your own free API key from YouTube to use this
application.

You can get your own key by following the instructions in this link:
[YouTube API](https://developers.google.com/youtube/v3/getting-started)

Once you have recieved the API key you must insert it inside the 'VideoList.js' file located inside the 'VideoActions' folder.
```python
const API_KEY = "{INSERT KEY HERE}";
````

