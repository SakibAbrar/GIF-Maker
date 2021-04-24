import "./App.css";

import { Grid, Button, CircularProgress, Typography, Container } from "@material-ui/core";
import {
  CloudUpload as UploadIcon,
  Send as SendIcon,
  CloudDownload as DownloadIcon,
} from "@material-ui/icons";

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { useEffect, useState } from "react";
const ffmpeg = createFFmpeg({ log: true }); // to see everylog on the console

function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();
  const [converting, setConverting] = useState(false);

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  const convertToGif = async () => {
    setConverting(true);
    // writing the file to memory and yes it uses client's memory and cpu. no backend
    // ffmpeg has it's own in memory file system
    // so we are fetching the file and then writing it to ffmpeg's filesystem as 'test.mp4
    ffmpeg.FS("writeFile", "test.mp4", await fetchFile(video));

    // run the  ffmpeg command
    await ffmpeg.run("-i", "test.mp4", "-ss", "0.0", "-f", "gif", "out.gif");
    // await ffmpeg.run('-i', 'test.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'out.gif');
    // -i for input -t to set the gif size, -ss to set an offset, -f to convertion type

    // read the result
    const data = ffmpeg.FS("readFile", "out.gif");

    // create a URL
    const url = URL.createObjectURL(new Blob([data.buffer], { type: "image/gif" }));
    setGif(url);
    setConverting(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: "100vh" }}
    >
      {ready ? (
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <div style={{ marginBottom: "10px" }}>
            <Typography variant="h3">Welcome Kings and Queens!</Typography>
            <Typography variant="h6">Upload your video here and convert it to GIF!</Typography>
          </div>
          {/* video html tag needs a url as src, so we convert our video to url by a built in function*/}
          {!gif && video && (
            <>
              <video
                controls
                width="400"
                // style={{ marginLeft: "auto", marginRight: "auto", display: "block" }}
                src={URL.createObjectURL(video)}
              />
              <br />
            </>
          )}
          <br />
          <Container style={{ textAlign: "center" }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadIcon />}
              onClick={() => setGif(null)}
            >
              {gif && video && "Upload Another"}
              {!gif && video && "Upload Again"}
              {!gif && !video && "Upload File"}
              <input
                accept=".mp4, .mkv, .mov, .flv, .wmv, .avi, .webm, .ogg, .mpeg"
                type="file"
                hidden
                onChange={(e) => setVideo(e.target.files?.item(0))}
              />
            </Button>
          </Container>
          <br />
          {video && (
            <>
              {!gif && (
                <Container style={{ marginTop: "10px", textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    component="label"
                    startIcon={!converting ? <SendIcon /> : null}
                    endIcon={converting ? <CircularProgress size={24} /> : null}
                    disabled={converting}
                    onClick={convertToGif}
                  >
                    {!converting && "Convert To GIF"}
                    {converting && "Converting..."}
                  </Button>
                </Container>
              )}
              {gif && (
                <Container>
                  <img alt="gif" src={gif} width="400" />
                  <br />
                  <div style={{ marginTop: "10px" }}>
                    <Typography variant="h6" display="inline">
                      Your GIF is ready!!&nbsp;&nbsp;
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      component="label"
                      startIcon={<DownloadIcon />}
                      onClick={() => {
                        const link = document.createElement("a");
                        link.download = `result.gif`;
                        link.href = gif;
                        link.click();
                      }}
                      download
                    >
                      Download
                    </Button>
                  </div>
                </Container>
              )}
            </>
          )}
        </Grid>
      ) : (
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Typography variant="h4">Loading...</Typography>
          <br />
          <CircularProgress color="inherit" />
        </Grid>
      )}
    </Grid>
  );
}
export default App;
