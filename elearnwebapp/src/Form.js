import React from "react";
import "./App.css";

class Form extends React.Component {
  state = {
    user: {}
  };

  changeUserHandler = (type, e) => {
    let value = "";

    if (type === "name") {
      value = e.target.value;
    } else {
      value = parseInt(e.target.value);
    }

    this.setState(prevState => ({
      user: {
        ...prevState.user,
        [type]: value
      }
    }));
  };

  render() {
    const user = this.state.user;

    return (
      <div className={"authForm"}>
        <form
          onSubmit={event => {
            event.preventDefault();
          }}
        >
          <h1>Заполинте форму</h1>

          <input
            type="text"
            placeholder="Имя в сети"
            value={user.name}
            onChange={value => this.changeUserHandler("name", value)}
          />
          <br />

          <input
            type="text"
            placeholder="Возраст"
            value={user.age}
            onChange={value => this.changeUserHandler("age", value)}
          />
          <br />

          <input
            type="text"
            placeholder="Курс"
            value={user.course}
            onChange={value => this.changeUserHandler("course", value)}
          />
          <br />

          {/* <input
            type="text"
            placeholder="Группа"
            value={user.team}
            onChange={value => this.changeUserHandler("team", value)}
          /> */}
          <br />
          <button
            onClick={() => this.props.submitUser(this.state.user)}
            disabled={Object.keys(this.state.user).length < 3}
          >
            Отправить
          </button>
        </form>
      </div>
    );
  }
}

export default Form;
