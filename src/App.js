import React, {useState, useEffect} from "react"
import Confetti from 'react-confetti'
import {nanoid} from 'nanoid'

import Die from './components/Die'
import Stats from './components/Stats'

// FALTA ADICIONAR O MELHOR RECORD DE LANÇAMENTOS


export default function App() {

  // ALL THE STATES
  const [dice, setDice] = useState(allNewDice())
  const [tenzies, setTenzies] = useState(false)
  const [stats, setStats] = useState({
    rolls: 0,
    time: 0,
    finalTime: 0
  })
  const [record, setRecord] = useState({
    time: localStorage.getItem('bestTime') ? parseInt(localStorage.getItem('bestTime')) : null,
    rolls: localStorage.getItem('bestRolls') ? parseInt(localStorage.getItem('bestRolls')) : null,
  })


  // EFFECT HOCK TO COUNT THE TIME IN SECONDS THE USER HAS BEEN PLAYING
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStat => ({
        ...prevStat,
        time: prevStat.time + 1
      }))
    }, 1000);
  
    return () => clearInterval(interval);
  }, [])

  

  // FUNCTION THAT GENERATES A SINGLE DIE
  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }
  }

  // FUNCTION THAT GENEREATES ALL THE NEW DICE
  function allNewDice() {
    let newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie())  
    }
    return newDice
  }


  // EFFECT HOCK THAT CHECKS IF THE PLAYER AS MEET THE CONDITIONS TO WIN THE GAME
  // IF SO THE LOCAL STORAGE WITH THE BEST RECORDS IS UPDATED AND THE STATS AS WELL
  useEffect(() => {
    let firstValue = dice[0].value
    let allSameValue = dice.every(die => die.value === firstValue)

    let allHold = dice.every(die => die.isHeld)
    if(allHold && allSameValue) {
      setTenzies(true)
      setStats(prevStats => ({
        ...prevStats,
        finalTime: prevStats.time
      }))

      if(stats.time < record.time || record.time === null) {
        localStorage.setItem('bestTime', stats.time)
      }
      if(stats.rolls < record.rolls || record.rolls === null) {
        localStorage.setItem('bestRolls', stats.rolls)
      }
    }
  },[dice])


  // FUNCTION THAT ROLLS THE DICE AGAIN BY CLICKING THE BUTTON
  function rerollDice() {
    setDice(oldDice => oldDice.map(die => {
      return die.isHeld ? die : generateNewDie()
    }))

    setStats(oldStats => ({
      ...oldStats,
      rolls: oldStats.rolls + 1
    }))
  }

  // FUNCTION THAT HOLDS A DICE BY CLICKING THE DICE WE WANT TO HOLD
  function holdDice(diceId) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === diceId ? {...die, isHeld: !die.isHeld} : die
    }))
  }

  // FUNCTION THAT STARTS A NEW GAME AND RESETS THE STATES
  function newGame() {
    setDice(allNewDice())
    setTenzies(false)
    setStats({
      rolls: 0,
      time: 0
    })
    setRecord({
      time: parseInt(localStorage.getItem('bestTime')),
      rolls: parseInt(localStorage.getItem('bestRolls'))
    })
  }
  
  // HERE I CREATE ALL "Die" COMPONENTS
  let elements = dice.map(die => (
    <Die 
      value={die.value}
      isHeld={die.isHeld} 
      key={die.id}
      holdDice={() => holdDice(die.id)}
    />
  ))


  return(
    <main>
      {tenzies && <Confetti width={window.innerWidth} height={window.innerHeight}/>}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. 
        Click each die to freeze it at its current value between rolls.
      </p>

      <Stats rolls={stats.rolls} time={stats.time} finalTime={stats.finalTime}/>

      
      <div>
        {record.time && <h2 className="stat-bold">Best Time:<b>{record.time} sec</b></h2>}
        {record.rolls && <h2 className="stat-bold">Best Rolls:<b>{record.rolls}</b></h2>}
      </div>
      

      <div className="die-group">
        {elements}
      </div>

      <button className="roll-btn" onClick={tenzies ? newGame : rerollDice}>
        {tenzies ? `New Game` : 'Roll'}
      </button>

    </main>
  )
}