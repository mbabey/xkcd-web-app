import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const URL_PLAIN = `http://localhost:8080`

function Comic(params) {
  const { number } = useParams();
  const [comicData, setComicData] = useState(null);

  useEffect(() => {
    const fetchComic = async () => {
      let res;
      if (isNaN(number)) {
        res = await fetch(URL_PLAIN);
      } else {
        res = await fetch(URL_PLAIN + `/${number}`);
      }
      const data = await res.json();
      
      setComicData(data);
    };

    fetchComic();
  }, [number]);

  if (!comicData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>xkcd Comic #{comicData.num}</h2>
      <img src={comicData.img} alt={comicData.alt} />
      <p>{comicData.alt}</p>
    </div>
  );
}

export default Comic;