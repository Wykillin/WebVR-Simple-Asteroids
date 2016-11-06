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
    } else if(this.props.doesIntersectWithLaser(this, this.state.x, this.state.y, this.state.z)) {
      this.props.laserHitAsteroid()
    } else {
      this.setState({
        x: this.state.x + 0.7 * this.state.vX,
        y: this.state.y + 0.7 * this.state.vY,
        z: this.state.z + 0.7 * this.state.vZ
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
    return {
      xAngle: this.props.x,
      yAngle: this.props.y,
      x: 0,
      y: 0.5,
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
    if(Math.abs(this.state.z) > 150 || Math.abs(this.state.y) > 150 || Math.abs(this.state.x) > 150 ) {
      this.props.removeLaser()
    } else {
      this.setState({x: this.state.x + this.state.vX, y: this.state.y + this.state.vY, z: this.state.z + this.state.vZ})
      this.props.updateXYZ(this, this.props.theKey, this.state.x, this.state.y, this.state.z)
      setTimeout(this.doPhysics, 10)
    }
  },
  render: function() {
    return (<a-sphere color="#000" height="4" radius="0.5" position={this.state.x + ' ' + this.state.y + ' ' + this.state.z} />)
    // return (<a-cylinder color="#000" height="4" radius="0.05" rotation={(this.state.xAngle + 90) + ' ' + this.state.yAngle + " 0"} position={this.state.x + ' ' + this.state.y + ' ' + this.state.z} />)
  }
})

var AFrameScene = React.createClass({
  getInitialState: function() {
    var myAsteroid = <Asteroid key='a' x={1.0} y={22.0} z={-100.0} laserHitAsteroid={this.laserHitAsteroid} hitCamera={this.hitCamera} doesIntersectWithLaser={this.doesIntersectWithLaser} />
    return {
      asteroids: [myAsteroid],
      lasers: [],
      numHitMe: 0,
      numDestroyed: 0,
      myCam: <Camera />
    }
  },
  componentDidMount() {
    setTimeout(this.shootLaser, 500)
  },
  doesIntersectWithLaser: function(asteroid, x, y, z) {
    var sumTwoRadii = 1.5
    var lasers = this.state.lasers
    for(var i = 0; i < lasers.length; i++) {
      var deltaX = (x-lasers[i].x)
      var deltaY = (y-lasers[i].y)
      var deltaZ = (z-lasers[i].z)
      var dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ)
      if(dist < sumTwoRadii) {
        return true
      }
    }
    return false
  },
  laserHitAsteroid: function(asteroid) {
    console.log('BOOM')
    var newAsteroids = this.state.asteroids
    newAsteroids.splice(asteroid, 1)
    newAsteroids.push(<Asteroid key={Math.random() * 9999999} laserHitAsteroid={this.laserHitAsteroid} hitCamera={this.hitCamera} x={Math.random() * (50.0) - 25} y={Math.random() * (50.0) - 25} z={Math.random() * (-40.0) - 90} doesIntersectWithLaser={this.doesIntersectWithLaser} />)
    this.setState({asteroids: newAsteroids, numHitMe: this.state.numDestroyed + 1})
  },
  hitCamera: function(asteroid) {
    var newAsteroids = this.state.asteroids
    newAsteroids.splice(asteroid, 1)
    newAsteroids.push(<Asteroid key={Math.random() * 9999999} laserHitAsteroid={this.laserHitAsteroid} hitCamera={this.hitCamera} x={Math.random() * (50.0) - 25} y={Math.random() * (50.0) - 25} z={Math.random() * (-40.0) - 90} doesIntersectWithLaser={this.doesIntersectWithLaser} />)
    this.setState({asteroids: newAsteroids, numHitMe: this.state.numHitMe + 1})
  },
  updateLaserXYZ: function(laser, key, x, y, z) {
    var newLasers = this.state.lasers
    var indexOfLaser = newLasers.map(function(x) {return x.key;}).indexOf(key)
    if(indexOfLaser > 0) {
      newLasers[indexOfLaser].x = x
      newLasers[indexOfLaser].y = y
      newLasers[indexOfLaser].z = z
      this.setState({lasers: newLasers})
    }
  },
  shootLaser: function() {
    var docCamRotation = document.getElementById('cam').getAttribute('rotation')
    var newLasersArray = this.state.lasers
    var laserKey = Math.random() * 9999999
    newLasersArray.push({laser: <Laser theKey={laserKey} key={laserKey} updateXYZ={this.updateLaserXYZ} x={docCamRotation.x} y={docCamRotation.y} removeLaser={this.removeLaser}/>, x: 0, y: 0, z: 0, key: laserKey})
    this.setState({lasers: newLasersArray})
    setTimeout(this.shootLaser, 1000)
  },
  removeLaser: function(laser) {
    var newLasersArray = this.state.lasers
    newLasersArray.splice(laser, 1)
    this.setState({lasers: newLasersArray})
  },
  render: function() {
    var myLasers = this.state.lasers.map(function(x){return x.laser})
    return (
      <a-scene>
        {this.state.myCam}
        <Sky />
        {this.state.asteroids}
        {myLasers}
      </a-scene>)
  }
})

ReactDOM.render(<AFrameScene />, document.getElementById('container'))
