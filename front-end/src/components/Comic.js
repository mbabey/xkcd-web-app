import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { MaxNumContext } from '../contexts/MaxNumContext';

import style from '../styles/main.module.css'

function Comic() {
  const { number } = useParams();

  const { maxNum } = useContext(MaxNumContext);

  const [comic, setComicData] = useState(null);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    const fetchComic = async () => {
      let res;
      if (isNaN(number) || number <= 0) {
        res = await fetch(process.env.REACT_APP_API_URL);
      } else {
        res = await fetch(process.env.REACT_APP_API_URL + `/${number}`);
      }
      const data = await res.json();

      setComicData(data);
    };

    fetchComic();
  }, [number]);

  if (!comic) {
    return (
      <div className={style.content}>
        <div className={style.sectionBreaker1}></div>
        <p>Loading</p>
        <div className={style.loader}><div></div><div></div><div></div></div>
        <div className={style.sectionBreaker2}></div>
      </div>
    );
  }

  if (comic.error) {
    return (
      <div className={style.content}>
        <div className={style.sectionBreaker1}></div>
        <p>Issue #{number} does not exist!</p>
        <div className={style.sectionBreaker2}></div>
      </div>
    );
  }

  let transcript = null;
  if (comic.transcript !== '' && comic.transcript !== undefined) {
    transcript = <Transcript transcript={comic.transcript} />
  }

  return (
    <div>
      <div className={style.sectionBreaker1}></div>
      <MetaData comic={comic} />
      <div className={style.sectionBreaker2}></div>
      <div className={style.content}>
        <div className={style.buttonWrapper}>
          <button
            className={style.button}
            onClick={() => setShowTranscript(!showTranscript)}
          >
            View {showTranscript ? "Comic" : "Transcript"}
          </button>
        </div>
        {
          (showTranscript && transcript)
          ||
          <ImageBlock comic={comic} />
        }
        <div className={style.sectionBreaker1}></div>
        <NavMenu currNum={comic.num} maxNum={maxNum} />
        <div className={style.sectionBreaker2}></div>
      </div>
    </div>
  );
}

function MetaData({ comic }) {
  return (
    <div className={style.metadataWrapper}>
      <p>{getDate(comic.day, comic.month, comic.year)}</p>
      <h2 className={style.issueTitle}>Issue #{comic.num}: {comic.safe_title}</h2>
      <p>View count: {comic.view_count}</p>
    </div>
  );
}

function getDate(day, month, year) {
  const date = new Date(year, month, day).toLocaleDateString(
    'default',
    { month: "long", day: "numeric", year: "numeric" }
  );
  return date;
}

function ImageBlock({ comic }) {
  return (
    <>
      <div className={style.imageWrapper}>
        <img className={style.image} src={comic.img} alt={comic.alt} />
      </div>
      <div className={style.subTextWrapper}>
        <p>{comic.alt}</p>
      </div>
    </>
  );
}

function Transcript({ transcript }) {
  if (transcript === '' || transcript === undefined) {
    return <div>
    </div>;
  }

  const regexBraces = /{{(.*?)}}|\[\[(.*?)\]\]|\(\((.*?)\)\)/g;
  const exposed = transcript.split(regexBraces).filter(Boolean);

  return (
    <div className={style.transcriptWrapper}>
      <h3 className={style.textCenter}>Transcript</h3>
      <div>
        {exposed.map(entry => {
          return (
            <p key={entry}>{entry}</p>
          );
        })}
      </div>
    </div>
  );
}

function NavMenu({ currNum, maxNum }) {

  let prevStyle = `${style.button}`;
  let nextStyle = `${style.button}`;

  if (currNum <= 1) {
    prevStyle += ` ${style.buttonDeactivated}`;
  }
  if (currNum >= maxNum) {
    nextStyle += ` ${style.buttonDeactivated}`;
  }

  return (
    <div className={style.buttonWrapper}>
      <button
        className={prevStyle}
        onClick={() => window.location.replace(`${currNum - 1}`)}
      >
        &lt;&lt; Prev
      </button>
      <button
        className={style.button}
        onClick={() => window.location.replace(`${getRandom(maxNum, 1)}`)}
      >
        Random
      </button>
      <button
        className={nextStyle}
        onClick={() => window.location.replace(`${currNum + 1}`)}
      >
        Next &gt;&gt;
      </button>
    </div>
  );
}

function getRandom(max, min) {
  return Math.ceil(Math.random() * (max - min) + min);
}

export default Comic;