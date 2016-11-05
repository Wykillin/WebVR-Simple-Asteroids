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
        <a-sky src="http://bjstlh.com/data/wallpapers/234/WDF_2704897.jpg">
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
  getInitialState: function() {
      return {
          words: this.props.readingMaterial.split(" "),
          currentWord: 0,
          playState: 'first',
          pressed: false
      }
  },
  render: function() {
    return (
      <a-scene onMouseDown={this.btnPress}>
        <Camera/>
        <Sky />
        <Words />
      </a-scene>)
  }
})

ReactDOM.render(<AFrameScene />, document.getElementById('container'))