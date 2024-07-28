import React from "react";
import ReactDOM from "react-dom/client";

import {
  ChakraBaseProvider,
  extendBaseTheme,
  theme as chakraTheme,
} from "@chakra-ui/react";

const { Button, List, Input, Tabs, Checkbox, Popover, Drawer } =
  chakraTheme.components;

const theme = extendBaseTheme({
  components: {
    Button,
    List,
    Input,
    Tabs,
    Checkbox,
    Popover,
    Drawer,
  },
});

import App from "./features/App/App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraBaseProvider theme={theme}>
      <App />
    </ChakraBaseProvider>
  </React.StrictMode>
);
