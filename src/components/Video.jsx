/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';

// eslint-disable-next-line react/prop-types
function Video({ srcObject, ...props }) {
  const ref = React.createRef();

  useEffect(() => {
    const videoElement = ref.current;
    videoElement.srcObject = srcObject;
  }, [srcObject]);

  // eslint-disable-next-line jsx-a11y/media-has-caption
  return <video ref={ref} {...props} />;
}

export default Video;
