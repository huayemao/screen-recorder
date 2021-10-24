/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

function About() {
  return (
    <>
      <h2>
        About
        {' '}
        <a href="#">xxx</a>
      </h2>
      <h3>Download</h3>
      <p>
        you can download the complete recording or any chunk as
        {' '}
        <abbr
          title="WebM is an audiovisual media file format"
        >
          WebM
        </abbr>
        {' '}
        file.
      </p>
    </>
  );
}

export default About;
