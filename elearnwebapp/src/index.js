import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Link, Route } from "react-router-dom";
import "./index.css";
import Main from "./Main";
import Form from "./Form";
import Analytics from "./Analytics";
import * as serviceWorker from "./serviceWorker";

// ReactDOM.render(<App />, document.getElementById("root"));

class App extends React.Component {
  state = {
    auth: true,
    mmm: "777"
  };

  render() {
    return (
      <div>
        <div className={"navigation"}>
          <nav>
            <Link to="/">Main</Link>
          </nav>
          <nav>
            <Link to="/Form">Form</Link>
          </nav>
          <nav>
            <Link to="/Analytics">Analytics</Link>
          </nav>
          <button onClick={() => this.setState({ mmm: "arghhhhh!" })}>
            test
          </button>
        </div>

        {this.state.auth ? (
          <div className={"routing"} style={{ width: "100%" }}>
            <Route
              exact
              path="/"
              component={() => <Main mmm={this.state.mmm} />}
            />
            <Route path="/Form" component={Form} />
            <Route path="/Analytics" component={() => <Analytics />} />
          </div>
        ) : (
          <div>NEED AUTH</div>
        )}
      </div>
    );
  }
}

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

serviceWorker.unregister();
