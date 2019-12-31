import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Link, Route, Redirect } from "react-router-dom";
import "./index.css";
import Main from "./Main";
import Form from "./Form";
import Analytics from "./Analytics";
import Tests from "./Tests";
import * as serviceWorker from "./serviceWorker";

// ReactDOM.render(<App />, document.getElementById("root"));

class App extends React.Component {
  state = {
    auth: true,
    userValid: false,
    sessionId: null
  };

  submitUser = async user => {
    console.log(user);
    if (user) {
      await this.setState({ userValid: true });
    }

    const res = await fetch("http://localhost:3100/api/newsessioncreate", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      // mode: "no-cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json"
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      body: JSON.stringify(user) // тип данных в body должен соответвовать значению заголовка "Content-Type"
    });

    if (res.status == 200) {
      const data = await res.json();
      console.log("resData:", data);
      if (data.sessionId) {
        await this.setState({ sessionId: data.sessionId });
      }
    }
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
          <nav>{/* <Link to="/Analytics">Analytics</Link> */}</nav>
        </div>
        <div className={"routing"} style={{ width: "100%" }}>
          {this.state.sessionId && <Redirect to="/Tests" />}

          <Route exact path="/" component={() => <Main />} />
          <Route
            path="/Form"
            component={() => <Form submitUser={this.submitUser}></Form>}
          />
          <Route path="/Analytics" component={() => <Analytics />} />
          <Route
            path="/Tests"
            component={() => <Tests sessionId={this.state.sessionId} />}
          />
        </div>
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
