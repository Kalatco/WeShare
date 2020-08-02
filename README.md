# WeShare

This application Allows users to stream videos with their friends from different computers without the trouble of having each person sychronize 
and search for the videos they want to play. This program does all the 
work for you by having one person type the video link into the program.

![Gif of UI](https://github.com/Kalatco/YouTubeMultiPlay/blob/master/gif1.gif)

## Author

Andrew Raftovich, Summer 2019.

[App is running here on heroku](https://youtube-we-share.herokuapp.com/)

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

Setup instructions:
```bash
npm install
node index.js
```
This command will start the server and you can access the site at 'localhost:5000' in your web browser.

## API key

You will need to get your own free API key from YouTube to use this
application.

You can get your own key by following the instructions in this link:
[YouTube API](https://developers.google.com/youtube/v3/getting-started)

Once you have received the API key you must insert it into the config/default.json file.
```
{
  "Youtube": {
    "api_key": "KEY_GOES_HERE",
  }
}
````

