var Camera = React.createClass({
  getInitialState: function() {
    return {
      pos: '0 0 0'
    }
  },
  render: function() {
    return (
        <a-camera position={this.state.pos}>
        </a-camera>
        )
  }
})

var Sky = React.createClass({
  render: function() {
    return (
        <a-sky src="./sky.jpg">
        </a-sky>
        )
  }
})

var Words = React.createClass({
  render: function() {
    return (<a-entity text={"text: Hello this is more than one word"} position="-1 0 -14" scale="1 1 1"></a-entity>)
  }
})

var AFrameScene = React.createClass({
  render: function() {
    return (
      <a-scene>
        <Camera/>
        <Sky />
        <Words />
      </a-scene>)
  }
})

ReactDOM.render(<AFrameScene />, document.getElementById('container'))