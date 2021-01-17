import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Switch, Link, Route, useHistory } from "react-router-dom"

import Yahtzee from "./Yahtzee"
import * as api from "./api"

const App = () => {
  const [player, setPlayer] = useState(window.localStorage.getItem("name") || null)

  const handleNameChange = (newName) => {
    window.localStorage.setItem("name", newName)
    setPlayer(newName)
  }

  return (
    <Router>
      <Header
        name={player}
        onNameChange={handleNameChange} />

      <Switch>
        <Route exact path="/">
          <Home player={player} />
        </Route>
        <Route exact path="/privacy">
          <Privacy />
        </Route>
        <Route exact path="/support">
          <Support />
        </Route>
        <Route path="/:gameId">
          <Yahtzee player={player} />
        </Route>
      </Switch>
    </Router>
  )
}

const Home = ({ name }) => {
  const history = useHistory()

  const handleClickOnNewGame = () => {
    api.create(name)
      .then(gameId => history.push(gameId.substring(1)))
  }

  return (
    <div class="home">
      <div class="action button" onClick={handleClickOnNewGame}>New Game</div>
      <div>
        <ul>
          <li><Link to="/privacy">Privacy</Link></li>
          <li><Link to="/support">Support</Link></li>
        </ul>
      </div>
    </div>)
}

const Privacy = () => (
  <div class="home">
    <Link to="/">← Go back</Link>
    <p>
      Dajsz and it's integrations are not storing any personal information, there 
      is no permanent storage behind the service - all data created gets removed 
      after 48 hours at the latest. You can check it for yourself - all code
      is available for the public:
    </p>

    <ul>
      <li><a href="https://github.com/akarasz/dajsz">Dajsz</a></li>
      <li><a href="https://github.com/akarasz/dajsz-slack">Slack integration</a></li>
      <li><a href="https://github.com/akarasz/yahtzee">Backend</a></li>
    </ul>

    <p>
      Dajsz uses Google Analytics for usage metrics. If you want to learn
      more about Google's privacy policy then you should head over 
      <a href="https://support.google.com/analytics/answer/6004245"> there</a>.
    </p>
  </div>
)

const Support = () => (
  <div class="home">
    <Link to="/">← Go back</Link>
    <p>
      If you have questions or concerns about Dajsz you can reach out at 
      <a href="mailto:support@dajsz.hu"> support@dajsz.hu</a>. If you found
      any bugs or issues you can report them 
      <a href="https://github.com/akarasz/dajsz/issues"> here</a>.
    </p>
  </div>
)

const Header = ({ name, onNameChange, onNewGame }) => {
  const promptForName = (currentName, callback) => {
    const showPrompt = () => prompt("Please enter your name:", currentName)
    let newName = showPrompt()

    while (newName !== null && newName.trim() === "") {
      newName = showPrompt()
    }

    if (newName !== null) {
      callback(newName.trim())
    }
  }

  useEffect(() => {
    if (name === null) {
      promptForName(name, onNameChange)
    }
  }, [name, onNameChange])

  const finalName = (name !== null ? name : "<Player>")

  return (
    <header>
      <div class="header-left">
        <Link to="/" className="title action item">
            <img src="/icon/dice-192.png" alt="logo" />
            <span>Dajsz</span>
        </Link>
      </div>
      <div class="header-right">
        <div class="name item" onClick={() => promptForName(name, onNameChange)}>You play as <em class="action" title={finalName}>{finalName}</em></div>
        <InviteButtonChooser />
      </div>
    </header>
    )
}

const InviteButtonChooser = () => {
  if (navigator.share) {
    return <ShareButton />
  } else if (navigator.clipboard) {
    return <ClipboardButton />
  } else {
    return null
  }
}

const ShareButton = () => {
  const handleClick = () => {
    navigator.share({
      title: "Invited to Dajsz",
      text: "Click to join: ",
      url: window.location.href,
    })
      .then(() => console.log("shared"))
      .catch((error) => console.log("error sharing", error))
  }

  return (
    <div class="share action item" title="Share" onClick={handleClick}>
      <img src="/share.png" alt="share" />
    </div>)
}

const ClipboardButton = () => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) {
      return
    }

    setTimeout(() => setCopied(false), 5000)
  }, [copied])

  const handleClick = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => setCopied(true))
  }

  const image = "/clipboard" + (copied ? "-copied" : "") + ".png"

  return (
    <div class="share action item" title="Share" onClick={handleClick}>
      <img src={image} alt="share" />
    </div>)
}

export default App
