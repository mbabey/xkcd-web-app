import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const URL_PLAIN = `http://localhost:8080`

function Comic(params) {
  const { number } = useParams();
  const [comic, setComicData] = useState(null);
  const [curr, setCurr] = useState(0);
  const [isprev, setIsprev] = useState(true);
  const [isnext, setIsnext] = useState(true);


  useEffect(() => {
    const fetchComic = async () => {
      let res;
      if (isNaN(number) || number <= 0) {
        res = await fetch(URL_PLAIN);
        setIsnext(false);
      } else {
        res = await fetch(URL_PLAIN + `/${number}`);
      }
      if (number === 1) {
        setIsprev(false);
      }
      const data = await res.json();
      setCurr(data.num);
      setComicData(data);
    };

    fetchComic();
  }, [number]);

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
        <button>Random</button>
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


export default Comic;