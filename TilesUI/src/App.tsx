import React, { useState, useEffect } from 'react';
import { getNItems, getNItemsFrom, deleteItems, createItem } from './api';
import './App.css';

const App: React.FC = () => {
  const getColsByWidth = (callback: (num: number) => number | void) => {
    if (sizes.width >= 1920) {
      return callback(8);
    }
    else if (sizes.width < 1920 && sizes.width >= 1645) {
      return callback(7);
    }
    else if (sizes.width < 1645 && sizes.width >= 1460) {
      return callback(6);
    }
    else if (sizes.width < 1460 && sizes.width >= 1265) {
      return callback(5);
    }
    else if (sizes.width < 1265 && sizes.width >= 1070) {
      return callback(4);
    }
    else if (sizes.width <= 1070 && sizes.width >= 870) {
      return callback(3);
    }
    else if (sizes.width < 870 && sizes.width >= 660) {
      return callback(2);
    }
    else if (sizes.width < 660) {
      return callback(1);
    }
  }
  const getRowsByHeight = (callback: (num: number) => number | void) => {
    if (sizes.height >= 1080) {
      return callback(6);
    }
    else if (sizes.height < 1080 && sizes.height >= 830) {
      return callback(5);
    }
    else if (sizes.height < 830 && sizes.height >= 700) {
      return callback(4);
    }
    else if (sizes.height < 700 && sizes.height >= 570) {
      return callback(3);
    }
    else if (sizes.height < 570 && sizes.height >= 440) {
      return callback(2);
    }
    else if (sizes.height < 440) {
      return callback(1);
    }
  }
  
  const [sizes, setSizes] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [prevCols, setPrevCols] = useState(0);
  const [cols, setCols] = useState(getColsByWidth((colCount) => colCount));
  const [prevRows, setPrevRows] = useState(0);
  const [rows, setRows] = useState(getRowsByHeight((rowCount) => rowCount));
  const [loadingState, setLoadingState] = useState(false);
  const initialStructuredTiles: JSX.Element[][] = [];
  const [structuredTiles, setStructuredTiles] = useState(initialStructuredTiles);
  const initialPreparedTiles: JSX.Element[] = [];
  const [preparedTiles, setPreparedTiles] = useState(initialPreparedTiles);

  const fetchFitting = async () => {
    return getNItems(+rows * +cols)
    .then((res) => res.data)
    .then((fetched) => {
      if (fetched.length > 0) {
        const fetchedJSXArray = fetched.map(el =>
          <div className='tile element'>
            {el.title}
          </div>);
        const rowArray: JSX.Element[][] = [];
        for (let i = 0; i < +rows; i++) {
          const newRow: JSX.Element[] = [];
          for (let j = 0; j < +cols; j++) {
            newRow.push(fetchedJSXArray[j + i * +cols]);
          }
          rowArray.push(newRow);
        }
        setStructuredTiles(rowArray);
      }
      else {
        (async () => {
          for (let i = 1; i <= 60; i++) {
            await createItem(i);
          }
          window.location.reload();
        })();
      }
    })
  }

  useEffect(() => {
    setLoadingState(true);
    fetchFitting()
      .finally(() => setLoadingState(false));
    const listener = () => setSizes({
      width: window.innerWidth,
      height: window.innerHeight
    });
    window.addEventListener('resize', listener);
    return () => {
      deleteItems()
      .finally(() =>  window.removeEventListener('resize', listener))
    }
  }, []);

  useEffect(() => {
    setLoadingState(true);
    getColsByWidth(num => {
      setPrevCols(+cols);
      setCols(num);
    })
  }, [window.innerWidth]);

  useEffect(() => {
    if (structuredTiles.length > 0) {
      const newRows: JSX.Element[][] = [];
      if (+cols < prevCols) {
        setLoadingState(false)
        for (const row of structuredTiles) {
          newRows.push(row.slice(0, -(prevCols- +cols)))
        }
        setStructuredTiles(newRows);
        updateGrid()
      }
      else if (+cols > prevCols) {
        const difference = +cols - prevCols;
        getNItemsFrom(prevCols * +rows - 1, +rows * difference)
        .then((res) => res.data)
        .then((fetched) => {
          const fetchedJSXArray = fetched.map(el =>
            <div className='tile element'>
              {el.title}
            </div>);
          for (let i = 0; i < +rows; i++) {
            const newRow = structuredTiles[i];
            for (let j = 0 + i * difference; j < difference + i * difference; j++) {
              newRow.push(fetchedJSXArray[j]);
            }
            newRows.push(newRow);
          }
          setStructuredTiles(newRows);
        })
        .catch(() => {
          console.log('Warning: resizing is too fast ')
          fetchFitting()
        })
        .finally(() => setLoadingState(false));
      }
    }
  }, [cols]);

  useEffect(() => {
    setLoadingState(true);
    getRowsByHeight(num => {
      setPrevRows(+rows);
      setRows(num)
    })
  }, [window.innerHeight]);

  useEffect(() => {
    if (structuredTiles.length > 0) {
      if (+rows < prevRows) {
        setLoadingState(false);
        setStructuredTiles(structuredTiles.slice(0, -(prevRows - +rows)));
        updateGrid();
      }
      else if (+rows > prevRows) {
        const difference = +rows - prevRows;
        getNItemsFrom(prevRows * +cols - 1, +cols * difference)
        .then((res) => res.data)
        .then((fetched) => {
          const fetchedJSXArray = fetched.map(el =>
            <div className='tile element'>
              {el.title}
            </div>);
          for (let i = 0; i < difference; i++) {
            const newRow: JSX.Element[] = [];
            for (let j = 0 + i * +cols; j < +cols + i * +cols; j++) {
              newRow.push(fetchedJSXArray[j]);
            }
            setStructuredTiles([...structuredTiles, newRow])
          }
        })
        .catch(() => {
          console.log('Warning: resizing is too fast ')
          fetchFitting()
        })
        .finally(() => setLoadingState(false))
      }
    }
  }, [rows]);

  const updateGrid = () => {
    const preparedArray: JSX.Element[] = [];
    for (const row of structuredTiles) {
      preparedArray.push(
        <div className='tile-row'>
          {row}
        </div>
      )
    }
    setPreparedTiles(preparedArray);
  }

  useEffect(() => {
    if (!loadingState) {
      updateGrid();
    }
  }, [loadingState])

  return (
    <div className="App">
      <header className='element'>
        Header
      </header>
      <main>
        <nav className='left-panel element'>
          Left side
        </nav>
        <article>
          {preparedTiles}
        </article>
        <aside className='right-panel element'>
          Right side
        </aside>
      </main>
      <footer className='element'>
        Footer
      </footer>
    </div>
  );
}

export default App;
