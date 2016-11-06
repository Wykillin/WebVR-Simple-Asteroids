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


var Laser = React.createClass({
	render: function() {
		console.log("Render called")
	return (
	<a-cylinder color="#000" height="4" radius="0.05" rotation="90 0 0" position="0 0 -4">
	</a-cylinder>)
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


var Asteroid = React.createClass({
  getInitialState() {
    return {
      x: this.props.x,
      y: this.props.y,
      z: this.props.z,
      velocity: 0.5
    }
  },
  componentDidMount: function() {
    setTimeout(this.doPhysics, 10)
  },
  doPhysics: function() {
    if(this.state.z >= 0) {
      this.props.hitCamera()
    } else {
      this.setState({
        z: this.state.z + this.state.velocity
      })
      setTimeout(this.doPhysics, 10)
    }
  },
  render: function() {
    return (<a-sphere src='./meteortexture.jpg' position={this.state.x+' '+this.state.y+' '+this.state.z}></a-sphere>)
  }
})

var AFrameScene = React.createClass({
  getInitialState: function() {
    var myAsteroid = <Asteroid key='a' x={0} y={0} z={-100} hitCamera={this.hitCamera} />
    return {
      asteroids: [myAsteroid],
      numHit: 0,
      numDestroyed: 0
    }
  },
  hitCamera: function(asteroid) {
    var newAsteroids = this.state.asteroids
    newAsteroids.splice(asteroid, 1)
    newAsteroids.push(<Asteroid key={Math.random() * 9999999} hitCamera={this.hitCamera} x={Math.random() * (10) - 5} y={Math.random() * (10) - 5} z={Math.random() * (-90)} />)
    this.setState({asteroids: newAsteroids})
  },
  render: function() {
    console.log(this.state)
    var Asteroids = this.state.asteroids
    return (
      <a-scene >
        <Camera/>
        <Sky />
        {Asteroids}
        <Laser />
      </a-scene>)
  }
})

ReactDOM.render(<AFrameScene />, document.getElementById('container'))
