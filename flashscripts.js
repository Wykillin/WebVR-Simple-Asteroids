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

var FlashCard = React.createClass({
  getInitialState() {
    return {
      front: 'What is the capital of USA',
      back: 'Washington D.C.',
      cardState: 0
    }
  },
  changeState: function() {
    if(this.state.cardState == 1) {
      var newCard = this.props.getNextCard()
      this.setState({
        cardState: (this.state.cardState + 1) % 2,
        front: newCard.front,
        back: newCard.back
      })
    } else {
      this.setState({cardState: (this.state.cardState + 1) % 2})
    }
  },
  render: function() {
    return (
      <a-box position="-1 -2 -4" scale="1 1 1" onMouseDown={this.changeState}>
        <a-entity position=" -3 2 0" text={"text: "+(this.state.cardState == 0 ? this.state.front : this.state.back)}></a-entity>
      </a-box>
      )
  }
})

var AFrameScene = React.createClass({
  getInitialState() {
    var cards = JSON.parse(this.props.cards)
    return {
      onCard: 0,
      cards: cards
    }
  },
  getNextCard: function() {
    console.log(this.state.cards.terms)
    var nextCard = this.state.cards.terms[Math.floor(Math.random() * this.state.cards.terms.length)]
    console.log(nextCard)
    return {
      front: nextCard.term,
      back: nextCard.definition
    }
  },
  render: function() {
    return (
      <a-scene>
        <Sky />
        <Camera />
        <FlashCard getNextCard={this.getNextCard}/>
      </a-scene>)
  }
})

var InputScene = React.createClass({
  submitText: function() {
    var text = document.getElementById('article').value
    console.log(this.props)
    if(text != ""){
      this.props.letsRead(text)
    } else {
      console.log("Text area is empty")
    }
  },
  render: function() {
    return (<div>
        <textarea id='article' rows="10" cols="50"></textarea>
        <button onClick={this.submitText}>VRash Cards!</button>
      </div>)
  }
})

var WebPage = React.createClass({
  getInitialState: function() {
    return {
      webState: 'input',
      cards: ''
    }
  },
  openVRashCards: function(text){
    this.setState({
      webState: 'VRash',
      cards: text
    })
  },
  render: function() {
    if(this.state.webState == 'input') {
      return (<InputScene letsRead={this.openVRashCards}/>)
    } else {
      return (<AFrameScene cards={this.state.cards}/>)
    }
  }
})

ReactDOM.render(<WebPage />, document.getElementById('container'))
