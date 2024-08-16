import React from "react";
import ReactDOM from "react-dom/client";

import {
  ChakraBaseProvider,
  extendBaseTheme,
  theme as chakraTheme,
} from "@chakra-ui/react";

const {
  Button,
  List,
  Input,
  Tabs,
  Checkbox,
  Popover,
  Drawer,
  Select,
  Menu,
  Modal,
} = chakraTheme.components;

const theme = extendBaseTheme({
  components: {
    Button,
    List,
    Input,
    Tabs,
    Checkbox,
    Popover,
    Drawer,
    Select,
    Menu,
    Modal,
  },
});

import App from "./features/app/App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraBaseProvider theme={theme}>
      <App />
    </ChakraBaseProvider>
  </React.StrictMode>
);
