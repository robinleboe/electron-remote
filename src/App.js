import { useRef } from 'react';
import './App.css';

function App() {
  const videoRef = useRef();

  const getStream = async (screenId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: screenId,
          },
        },
      });

      handleStream(stream);
    } catch (err) {
      console.log(err);
    }
  };

  const handleStream = (stream) => {
    let { width, height } = stream.getVideoTracks()[0].getSettings();

    window.electronAPI.setSize({
      width,
      height,
    });

    videoRef.current.srcObject = stream;
    videoRef.current.onloadedmetadata = (e) => videoRef.current.play();
  };

  window.electronAPI.getScreenId((event, screenId) => {
    console.log('Screen ID: ', screenId);
    getStream(screenId);
  });

  return (
    <div className='App'>
      <>
        <span>video screen</span>
        <video ref={videoRef} className='video'>
          Video not available.
        </video>
      </>
    </div>
  );
}

export default App;
