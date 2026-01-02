import { useRef } from "react";
import Seo from "../../components/seo";
import { useSelector } from "react-redux";
import YouTube from "react-youtube";

const Dashboard = ({ videoId }) => {
  const user = useSelector((state) => state.initialState.user);

  const playerRef = useRef(null);
  const onReady = (event) => {
    playerRef.current = event.target;

    // 1. Check if we have a saved time for this video
    // const savedTime = localStorage.getItem(`yt-resume-${videoId}`);
    const savedTime = localStorage.getItem(`yt-resume-TxGbYR6kZpg`);
    if (savedTime) {
      event.target.seekTo(parseFloat(savedTime));
    }
  };

  const onStateChange = (event) => {
    // 2. State '1' means the video is playing
    if (event.data === 1) {
      const saver = setInterval(() => {
        const currentTime = event.target.getCurrentTime();
        // localStorage.setItem(`yt-resume-${videoId}`, currentTime);
        localStorage.setItem(`yt-resume-TxGbYR6kZpg`, currentTime);
      }, 3000); // Save every 3 seconds

      // Clear interval when video pauses or ends
      event.target.saverInterval = saver;
    } else {
      clearInterval(event.target.saverInterval);
    }
  };

  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <>
      <Seo pageTitle="Dashboard" />
      <h1>Welcome, {user.name}</h1>
      {/* <YouTube videoId={videoId} opts={opts} onReady={onReady} onStateChange={onStateChange} />; */}
      <YouTube videoId="TxGbYR6kZpg" opts={opts} onReady={onReady} onStateChange={onStateChange} />;
    </>
  );
};

export default Dashboard;
