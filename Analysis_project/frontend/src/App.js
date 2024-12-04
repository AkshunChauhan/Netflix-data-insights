import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [content, setContent] = useState([]);
  const [genreGraph, setGenreGraph] = useState('');
  const [ratingsGraph, setRatingsGraph] = useState('');
  const [trendGraph, setTrendGraph] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/')
      .then(response => {
        setGenreGraph(response.data.genres_graph);
        setRatingsGraph(response.data.ratings_graph);
        setTrendGraph(response.data.trend_graph);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const filterContent = (year, genre) => {
    axios.get('http://127.0.0.1:8000/filter/', {
      params: { year: year, genre: genre }
    })
      .then(response => {
        setContent(response.data.content);
      })
      .catch(error => {
        console.error('Error fetching filtered content:', error);
      });
  };

  return (
    <div>
      <h1>Netflix Content</h1>
      <div>
        <img src={genreGraph} alt="Genre Graph" />
        <img src={ratingsGraph} alt="Ratings Graph" />
        <img src={trendGraph} alt="Trend Graph" />
      </div>

      <div>
        <button onClick={() => filterContent('2020', 'Action')}>Filter by Action 2020</button>
      </div>

      <div>
        <h2>Filtered Content</h2>
        <ul>
          {content.map(item => (
            <li key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.type} | {item.release_year}</p>
              <p>{item.rating}</p>
              <p>{item.listed_in}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
