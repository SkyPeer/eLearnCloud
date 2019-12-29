import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Link, Route } from "react-router-dom";
import "./index.css";
import Main from "./App";
import Form from "./Form";
import Analytics from "./Analytics";
import * as serviceWorker from "./serviceWorker";

// ReactDOM.render(<App />, document.getElementById("root"));

const Dashboard = () => (
  <div style={{ backgroundColor: "yellow", width: "auto" }}>Dashboard!</div>
);
const Dashboard2 = () => (
  <div style={{ backgroundColor: "yellow", width: "auto" }}>Dashboard!2</div>
);

const App = () => (
  <div>
    <div
      className={"navigation"}
      // style={{
      //   `padding: 10`
      // }}
    >
      <nav>
        <Link to="/">Main</Link>
      </nav>
      <nav>
        <Link to="/Form">Main</Link>
      </nav>
      <nav>
        <Link to="/Analytics">Analytics</Link>
      </nav>
    </div>

    <div
      className={"routing"}
      style={{ backgroundColor: "gray", width: "100%" }}
    >
      <Route exact path="/" component={Main} />
      <Route path="/Form" component={Form} />
      <Route path="/Analytics" component={Analytics} />
    </div>
  </div>
);

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

serviceWorker.unregister();
