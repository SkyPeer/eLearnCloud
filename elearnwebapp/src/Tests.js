import React from "react";
import "./App.css";

class Tests extends React.Component {
  state = {
    tests: [],
    selectedOption: null,
    answers: {},
    result: null
  };

  componentDidMount = () => {
    console.log("Tests componentDidMount");
    this.getTests();
  };

  handleOptionChange = async (e, questionId) => {
    console.log("handleOptionChange", e.target.value, questionId);

    const answer = e.target.value;
    await this.setState(prevState => ({
      answers: {
        ...prevState.answers,
        [questionId]: parseInt(answer)
      }
    }));
  };

  getTests = async () => {
    const res = await fetch("http://localhost:3100/api/getTests", {
      method: "GET"
    });
    if (res.status == 200) {
      const data = await res.json();
      console.log("TESTSDATA", data);
      this.setState({ tests: data });
    }
  };

  setAnswers = async () => {
    const res = await fetch("http://localhost:3100/api/setAnswers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        answers: this.state.answers,
        sessionId: this.props.sessionId
      })
    });

    if (res.status == 200) {
      const data = await res.json();
      console.log("resData:", data);
      await this.setState({ result: data });

      // if (data.sessionId) {
      //   await this.setState({ sessionId: data.sessionId });
      // }
    }
  };

  getQuestion = q => {
    return (
      <div className="question">
        {q.question}
        {q.answers.map((answer, index) => {
          return (
            <div className="radio" key={index}>
              <label>
                <input
                  type="radio"
                  value={answer.id}
                  onChange={e => this.handleOptionChange(e, q.questionId)}
                  checked={this.state.answers[q.questionId] == answer.id}
                />
                {answer.description}
              </label>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    return (
      <div>
        {!this.state.result ? (
          <div>
            <form>
              {this.state.tests.map((question, index) => (
                <div key={index}>{this.getQuestion(question)}</div>
              ))}
            </form>
            <button onClick={() => this.setAnswers()}>Отправить</button>
          </div>
        ) : (
          <div>
            <b className="raiting">Оценка:</b>
            {"  " + this.state.result.raiting}
            <div>
              {this.state.result.failedQuestions.map((question, index) => (
                <div
                  className="failedQuestion"
                  key={index}
                  style={{ color: "red" }}
                >
                  {" - " + question}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Tests;
