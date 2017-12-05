pageflow.react.registerTextEmbed('greeting', {
  component: class Greeting extends React.Component {
    constructor(props) {
      super(props);
      this.state = {c: 0};

      this.handleClick = () => {
        this.setState({c: this.state.c + 1});
      }
    }

    render() {
      return (
        <div style={{'pointerEvents': 'all'}}>
          Hello {this.props.name || 'reader'} <br />
          Counter: {this.state.c} <br />
          <button onClick={this.handleClick}>Incr</button>
        </div>
      );
    }
  }
});
