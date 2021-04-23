import './App.css';

import {createFFmpeg, fetchFile} from "@ffmpeg/ffmpeg";
import { useEffect, useState } from 'react';
const ffmpeg = createFFmpeg({log:true}); // to see everylog on the console

function App() {

  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const load  = async () => {
    await ffmpeg.load();
    setReady(true);
  }

  const convertToGif = async () => {
    // writing the file to memory and yes it uses client's memory and cpu. no backend
    // ffmpeg has it's own in memory file system
    // so we are fetching the file and then writing it to ffmpeg's filesystem as 'test.mp4
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

    // run the  ffmpeg command
    await ffmpeg.run('-i', 'test.mp4', '-ss', '0.0', '-f', 'gif', 'out.gif');
    // await ffmpeg.run('-i', 'test.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'out.gif');
    // -i for input -t to set the gif size, -ss to set an offset, -f to convertion type

    // read the result
    const data = ffmpeg.FS('readFile', 'out.gif');

    // create a URL
    const url = URL.createObjectURL(new Blob([data.buffer]), {type: 'image/gif'});
    setGif(url);

  }

  useEffect(() => {
    load();
  }, []);

  return ready?(
    <div className="App">
      {/* video html tag needs a url as src, so we convert our video to url by a built in function*/}
      { video && <video controls width="250" src={URL.createObjectURL(video)}>
        </video>}
        <br />
      <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} /> <br />
      {video && 
      <button onClick={convertToGif}>Convert To GIF</button>}

      {gif && <><h3>Result</h3><img alt="gif" src={gif} width="250" /></>}
    </div>
  ): (<p>Loading...</p>);
}
export default App;
