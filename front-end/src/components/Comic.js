import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { MaxNumContext } from '../contexts/MaxNumContext';

import style from '../styles/main.module.css'

function Comic() {
  const { number } = useParams();

  const { maxNum } = useContext(MaxNumContext);

  const [comic, setComicData] = useState(null);
  const [curr, setCurr] = useState(0);
  const [isprev, setIsprev] = useState(true);
  const [isnext, setIsnext] = useState(true);

  useEffect(() => {
    const fetchComic = async () => {
      let res;
      if (isNaN(number) || number <= 0) {
        res = await fetch(process.env.REACT_APP_API_URL);
      } else {
        res = await fetch(process.env.REACT_APP_API_URL + `/${number}`);
      }
      const data = await res.json();

      if (data.num < maxNum) {
        setIsnext(true);
      } else {
        setIsnext(false);
      }
      if (data.num > 1) {
        setIsprev(true);
      } else {
        setIsprev(false);
      }

      setCurr(data.num);
      setComicData(data);
    };

    fetchComic();
  }, [number, maxNum]);

  if (!comic) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className={style.title}>#{comic.num}: {comic.safe_title}</h2>
      <div className={style.metadataWrapper}>
        <p>{getDate(comic.day, comic.month, comic.year)}</p>
        <p>View count: {comic.view_count}</p>
      </div>
      <p className={style.title}></p>
      <div className={style.content}>
        <div className={style.imageWrapper}>
          <img className={style.image} src={comic.img} alt={comic.alt} />
        </div>
        <div className={style.altWrapper}>
          <p className={style.altText}>{comic.alt}</p>
          {parseTranscript(comic.transcript)}
        </div>
        <div className={style.buttonWrapper}>
          {isprev && <button
            className={style.button}
            onClick={() => window.location.replace(`${curr - 1}`)}
          >
            &lt;&lt; Prev
          </button>}
          <button
            className={style.button}
            onClick={() => window.location.replace(`${getRandom(maxNum, 1)}`)}
          >
            Random
          </button>
          {isnext && <button
            className={style.button}
            onClick={() => window.location.replace(`${curr + 1}`)}
          >
            Next &gt;&gt;
          </button>}
        </div>

      </div>
    </div>
  );
}

function getDate(day, month, year) {
  return year + "/" + month + "/" + day;
}

function getRandom(max, min) {
  return Math.ceil(Math.random() * (max - min) + min);
}

function parseTranscript(transcript) {
  if (transcript === '') {
    return <></>;
  }

  const titleMatches = transcript.match(/{{(.*?)}}/g);
  const contextMatches = transcript.match(/\(\((.*?)\)\)|\[\[(.*?)\]\]/g);

  const regexBraces = /{{(.*?)}}|\[\[(.*?)\]\]|\(\((.*?)\)\)/g;
  const noMatches = transcript.split(regexBraces).filter(Boolean);

  return (
    <>
      <h3 className={style.title}>Transcript</h3>
      <div>
        <p>Title: {titleMatches}</p>
        <p>Context: {contextMatches}</p>
        <p>Transcription: {noMatches}</p>
      </div>
    </>
  );
}

export default Comic;