import React, { Component } from "react";
import { createGlobalStyle } from "styled-components";
import FileReaderInput from "react-file-reader-input";
import { ReactReader } from "./modules";
import {
  Container,
  ReaderContainer,
  Bar,
  LogoWrapper,
  Logo,
  GenericButton,
  CloseIcon,
  FontSizeButton,
  ButtonWrapper
} from "./Components";

const storage = global.localStorage || null;

const DEMO_URL =
  "https://gerhardsletten.github.io/react-reader/files/alice.epub";
const DEMO_NAME = "Alice in wonderland";

const GlobalStyle = createGlobalStyle`
  * {
    font-family: "Georgia", "serif", "Driod Serif";
    margin: 0;
    padding: 0;
    color: inherit;
    font-size: inherit;
    font-weight: 300;
    line-height: 1.7;
    word-break: break-word;
  }
  html {
    font-size: 62.5%;
  }
  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    font-size: 1.8rem;
    background: #333;
    position: absolute;
    height: 100%;
    width: 100%;
    color: #fff;

  }
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullscreen: false,
      location:
        storage && storage.getItem("epub-location")
          ? storage.getItem("epub-location")
          : 2,
      localFile: null,
      localName: null,
      largeText: false
    };
    this.rendition = null;
  }

  toggleFullscreen = () => {
    this.setState(
      {
        fullscreen: !this.state.fullscreen
      },
      () => {
        setTimeout(() => {
          const evt = document.createEvent("UIEvents");
          evt.initUIEvent("resize", true, false, global, 0);
        }, 1000);
      }
    );
  };

  onLocationChanged = (location) => {
    this.setState(
      {
        location
      },
      () => {
        storage && storage.setItem("epub-location", location);
      }
    );
  };

  onToggleFontSize = () => {
    const nextState = !this.state.largeText;
    this.setState(
      {
        largeText: nextState
      },
      () => {
        this.rendition.themes.fontSize(nextState ? "140%" : "100%");
      }
    );
  };

  getRendition = (rendition) => {
    console.log("getRendition callback", rendition);
    // Set inital font-size, and add a pointer to rendition for later updates
    const { largeText } = this.state;
    this.rendition = rendition;
    rendition.themes.fontSize(largeText ? "140%" : "100%");
    rendition.themes.register("custom", {
      body: {
        "scrollbar-color": "#d4aa70 #e4e4e4",
        "scrollbar-width": "thin"
      },
      p: {
        "line-height": "1.7",
        color: "rgba(61,61,78,1)",
        "font-weight": "400",
        "overflow-wrap": "break-word"
        // "font-family": "Droid Serif"
      },
      h1: {
        // "font-family": "Nunito Sans",
        color: "rgba(46,46,64,1)",
        "font-size": "2.25rem",
        "line-height": "2.5rem"
      },
      h2: {
        // "font-family": "Nunito Sans",
        color: "rgba(46,46,64,1)",
        "font-size": "2.25rem",
        "line-height": "2.5rem"
      },
      h3: {
        // "font-family": "Nunito Sans",
        color: "rgba(46,46,64,1)",
        "font-size": "2.25rem",
        "line-height": "2.5rem"
      },
      h4: {
        // "font-family": "Nunito Sans",
        color: "rgba(46,46,64,1)",
        "font-size": "2.25rem",
        "line-height": "2.5rem"
      }
      // section: {
      //   "padding-right": "400px",
      //   "padding-left": "400px"
      // }
    });

    // rendition.themes.font(`Droid Serif`);
    rendition.themes.fontSize("20px");
    rendition.themes.select("custom");
  };
  handleChangeFile = (event, results) => {
    if (results.length > 0) {
      const [e, file] = results[0];
      if (file.type !== "application/epub+zip") {
        return alert("Unsupported type");
      }
      this.setState({
        localFile: e.target.result,
        localName: file.name,
        location: null
      });
    }
  };
  render() {
    const { fullscreen, location, localFile, localName } = this.state;
    return (
      <Container>
        <GlobalStyle />
        <Bar>
          <ButtonWrapper>
            <FileReaderInput as="buffer" onChange={this.handleChangeFile}>
              <GenericButton>Upload local epub</GenericButton>
            </FileReaderInput>
            <GenericButton onClick={this.toggleFullscreen}>
              Use full browser window
              <CloseIcon />
            </GenericButton>
          </ButtonWrapper>
        </Bar>
        <ReaderContainer fullscreen={fullscreen}>
          <ReactReader
            url={localFile || DEMO_URL}
            epubOptions={{
              flow: "scrolled",
              manager: "continuous"
            }}
            location={location}
            locationChanged={this.onLocationChanged}
            getRendition={this.getRendition}
          />
          <FontSizeButton onClick={this.onToggleFontSize}>
            Toggle font-size
          </FontSizeButton>
        </ReaderContainer>
      </Container>
    );
  }
}

export default App;
