var Camera = React.createClass({
  getInitialState: function() {
    return {
      pos: '0 -1 0'
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
    var x = this.props.x
    var y = this.props.y
    var z = this.props.z
    var totalDistance = Math.sqrt(x * x + y * y + z * z)
    console.log(totalDistance)
    return {
      x: this.props.x,
      y: this.props.y,
      z: this.props.z,
      vX: -(x / totalDistance),
      vY: -(y / totalDistance),
      vZ: -(z / totalDistance)
    }
  },
  componentDidMount: function() {
    console.log(this.state)
    setTimeout(this.doPhysics, 10)
  },
  doPhysics: function() {
    if(this.state.z >= 0) {
      this.props.hitCamera()
    } else {
      this.setState({
        x: this.state.x + this.state.vX,
        y: this.state.y + this.state.vY,
        z: this.state.z + this.state.vZ
      })
      setTimeout(this.doPhysics, 10)
    }
  },
  render: function() {
    // console.log("render called", this.state)
    return (<a-sphere src='./meteortexture.jpg' position={this.state.x+' '+this.state.y+' '+this.state.z}></a-sphere>)
  }
})

var AFrameScene = React.createClass({
  getInitialState: function() {
    var myAsteroid = <Asteroid key='a' x={1.0} y={22.0} z={-100.0} hitCamera={this.hitCamera} />
    return {
      asteroids: [myAsteroid],
      numHitMe: 0,
      numDestroyed: 0
    }
  },
  hitCamera: function(asteroid) {
    var newAsteroids = this.state.asteroids
    newAsteroids.splice(asteroid, 1)
    newAsteroids.push(<Asteroid key={Math.random() * 9999999} hitCamera={this.hitCamera} x={Math.random() * (200.0) - 100} y={Math.random() * (200.0) - 100} z={Math.random() * (-40.0) - 90} />)
    this.setState({asteroids: newAsteroids, numHitMe: this.state.numHitMe + 1})
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
