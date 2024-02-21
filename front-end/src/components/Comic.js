import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { MaxNumContext } from '../contexts/MaxNumContext';

const URL_PLAIN = `http://localhost:8080`

function Comic(params) {
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
        res = await fetch(URL_PLAIN);
      } else {
        res = await fetch(URL_PLAIN + `/${number}`);
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
      <h1>#{comic.num}: {comic.safe_title}</h1>

      <img src={comic.img} alt={comic.alt} />
      <div>
        {isprev && <button onClick={() => {
          window.location.replace(`${curr - 1}`)
        }}>
          Prev
        </button>}
        <button onClick={() => window.location.replace(`${getRandom(maxNum, 1)}`)}
        >
          Random
        </button>
        {isnext && <button onClick={() => {
          window.location.replace(`${curr + 1}`)
        }}>
          Next
        </button>}
      </div>
      <p>{comic.alt}</p>
    </div>
  );
}

function getRandom(max, min)
{
 return Math.ceil(Math.random() * (max - min) + min);
}

export default Comic;