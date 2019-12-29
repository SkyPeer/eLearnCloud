import React from "react";
import "./App.css";

class Form extends React.Component {
  state = {
    user: {}
  };

  changeUserHandler = (type, value) => {
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

          <input type="text" placeholder="Введите Имя" value={user.name} />
          <br />

          <input type="text" placeholder="Возраст" value={user.age} />
          <br />

          <input type="text" placeholder="Курс" value={user.course} />
          <br />

          <input type="text" placeholder="Группа" value={user.team} />
          <br />
          <button onClick={() => this.props.submitHandler()}>Отправить</button>
        </form>
      </div>
    );
  }
}

export default Form;
