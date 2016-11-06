var Camera = React.createClass({
  getInitialState: function() {
    return {
      pos: '0 -1 0'
    }
  },
  render: function() {
    return (
        <a-camera id='cam' position={this.state.pos}>
          <a-cursor color="#FF0000"></a-cursor>
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

var Asteroid = React.createClass({
  getInitialState: function() {
    var x = this.props.x
    var y = this.props.y
    var z = this.props.z
    var totalDistance = Math.sqrt(x * x + y * y + z * z)
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
    return (<a-sphere src='./meteortexture.jpg' position={this.state.x+' '+this.state.y+' '+this.state.z} ></a-sphere>)
  }
})

var Laser = React.createClass({
  getInitialState: function() {
    var vX = -Math.sin(3.14 * this.props.y / 180)
    var vY = Math.sin(3.14 * this.props.x / 180)
    var vZ = -Math.cos(3.14 * this.props.y / 180)
    console.log(this.props.x, this.props.y, vX, vY, vZ)
    return {
      xAngle: this.props.x,
      yAngle: this.props.y,
      x: 0,
      y: 0,
      z: 0,
      vX: vX,
      vY: vY,
      vZ: vZ
    }
  },
  componentDidMount: function() {
    setTimeout(this.doPhysics, 10)
  },
  doPhysics: function(){
    if(this.state.z < -15) {
      this.props.removeLaser()
    } else {
      this.setState({x: this.state.x + this.state.vX, y: this.state.y + this.state.vY, z: this.state.z + this.state.vZ})
      setTimeout(this.doPhysics, 10)
    }
  },
  render: function() {
    return (<a-cylinder color="#000" height="4" radius="0.05" rotation={(this.state.xAngle + 90) + ' ' + this.state.yAngle + " 0"} position={this.state.x + ' ' + this.state.y + ' ' + this.state.z} />)
  }
})

var AFrameScene = React.createClass({
  getInitialState: function() {
    var myAsteroid = <Asteroid key='a' x={1.0} y={22.0} z={-100.0} hitCamera={this.hitCamera} />
    return {
      asteroids: [myAsteroid],
      lasers: [],
      numHitMe: 0,
      numDestroyed: 0,
      myCam: <Camera />
    }
  },
  componentDidMount() {
    setTimeout(this.shootLaser, 1000)
  },
  hitCamera: function(asteroid) {
    var newAsteroids = this.state.asteroids
    newAsteroids.splice(asteroid, 1)
    newAsteroids.push(<Asteroid key={Math.random() * 9999999} hitCamera={this.hitCamera} x={Math.random() * (200.0) - 100} y={Math.random() * (200.0) - 100} z={Math.random() * (-40.0) - 90} />)
    this.setState({asteroids: newAsteroids, numHitMe: this.state.numHitMe + 1})
  },
  shootLaser: function() {
    var docCamRotation = document.getElementById('cam').getAttribute('rotation')
    var newLasersArray = this.state.lasers
    newLasersArray.push(<Laser key={Math.random() * 9999999} x={docCamRotation.x} y={docCamRotation.y} removeLaser={this.removeLaser}/>)
    this.setState({lasers: newLasersArray})
    setTimeout(this.shootLaser, 500)
  },
  removeLaser: function(laser) {
    console.log('removed')
    var newLasersArray = this.state.lasers
    newLasersArray.splice(laser, 1)
    this.setState({lasers: newLasersArray})
  },
  render: function() {
    return (
      <a-scene>
        {this.state.myCam}
        <Sky />
        {this.state.asteroids}
        {this.state.lasers}
      </a-scene>)
  }
})

ReactDOM.render(<AFrameScene />, document.getElementById('container'))
