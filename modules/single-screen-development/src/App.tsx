import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { FC } from "react";
import { Provider } from "react-redux";
import "./App.css";
import { store } from "./app/store";
import Main from "./Main";

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
        <Main></Main>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
