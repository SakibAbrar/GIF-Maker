import './App.css';

import {createFFmpeg, fetchFile} from "@ffmpeg/ffmpeg";
import { useEffect, useState } from 'react';
const ffmpeg = createFFmpeg({log:true}); // to see everylog on the console

function App() {

  const [ready, setReady] = useState(false);

  const load  = async () => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    load();
  }, []);

  return ready?(
    <div className="App">

    </div>
  ): (<p>Loading...</p>);
}

export default App;
