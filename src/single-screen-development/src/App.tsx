import { Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { FC } from "react";
import { Provider } from "react-redux";
import "./App.css";
import { store } from "./app/store";
import Body from "./Body/Body";
import Header from "./Header/Header";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App: FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box
          className="App"
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#1E1E1E",
            height: "100vh",
            width: "100vw",
            alignItems: "center",
            padding: "0px 95px",
          }}
        >
          <Header></Header>
          <Body></Body>
        </Box>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
