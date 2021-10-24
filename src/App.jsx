import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import About from './components/About';
import Video from './components/Video';

function App() {
  // eslint-disable-next-line no-unused-vars
  const [fullChunkRecordings, setFullChunkRecordings] = useState([]);
  const [isRecordingRunning, SetRecordingRunning] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [fullObjectURL, setFullObjectURL] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const stopCapture = () => {
    SetRecordingRunning(false);

    // Stop all the Tracks on the Video Elements Source Object
    if (currentVideo) {
      const tracks = currentVideo.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    }

    // Create a Object URL of the Full Recording as WebM
    const url = window.URL.createObjectURL(
      new Blob(fullChunkRecordings, {
        type: 'video/webm',
      }),
    );

    // Remove the Old Source Object from the Video Element and Assign the new Object URL
    // then Play the Video
    setCurrentVideo(null);
    setFullObjectURL(url);
  };

  useEffect(() => {
    if (currentVideo) {
      currentVideo.addEventListener('inactive', (event) => {
        stopCapture(event);
      });
      // Define the MediaRecorder for the Full Video Recording
      const mediaRecorder = new MediaRecorder(currentVideo, {
        mimeType: 'video/webm',
      });

      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event?.data?.size > 0) {
          fullChunkRecordings.push(event.data);
        }
      });

      mediaRecorder.addEventListener('inactive', () => {
        mediaRecorder.stop();
      });
      // Start Recording
      mediaRecorder.start(10);
    }

    return () => {
    };
  }, [currentVideo]);

  const handleError = (err) => {
    const mapping = {
      NotAllowedError:
        'No Permissions to Record your User Video and Audio or you canceled the Recording.',
      NotSupportedError:
        'Your Browser does not support User Video and Audio Recording yet.',
    };

    const msg = mapping[err.name] || ` Error: ${err}`;
    setErrMsg(msg);
  };

  const startCapture = async () => {
    // Clear Data from the Previous Recording
    setCurrentVideo(null);
    setErrMsg('');

    if (fullObjectURL) {
      window.URL.revokeObjectURL(fullObjectURL);
    }

    setFullObjectURL('');

    if (!navigator?.mediaDevices?.getDisplayMedia) {
      SetRecordingRunning(false);
      setErrMsg(
        '&#128165; Your Browser does not support Screen Recording yet.',
      );
      return;
    }

    // Try to Record the Screen
    try {
      const originalVideo = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
        },
        audio: true,
      });

      setCurrentVideo(originalVideo);

      SetRecordingRunning(true);
    } catch (err) {
      SetRecordingRunning(false);
      handleError(err);
    }
  };

  return (
    <div className="App">
      <div id="wrapper">
        <header>
          <h1>
            &#128249; Online Screen Recorder
            <FontAwesomeIcon icon={faCoffee} />
          </h1>
        </header>
        <article role="main">
          <p className="buttons">
            <button
              id="button"
              type="button"
              onClick={() => {
                if (isRecordingRunning) {
                  stopCapture();
                } else {
                  startCapture();
                }
              }}
            >
              <i className="fa fa-play-circle" aria-hidden="true" />
              {isRecordingRunning ? 'Stop Capture' : 'Start Capture'}
            </button>
            {errMsg && (
            <span id="errorMsg">
              &#128165;
              {errMsg}
            </span>
            )}
            {fullObjectURL && (
              <>
                <a
                  href={fullObjectURL}
                  id="resultLinkWebM"
                  className="button"
                  download="screenrecording.webm"
                >
                  <i className="fa fa-arrow-circle-down" aria-hidden="true" />
                  Download WebM
                </a>
              </>
            )}
          </p>

          <Video
            id="video"
            src={fullObjectURL}
            srcObject={currentVideo}
            controlsList="nodownload"
            muted
            playsInline
            autoPlay
            controls
          />
          <About />
        </article>
      </div>
    </div>
  );
}

export default App;
