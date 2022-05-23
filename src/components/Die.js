import React from "react"


export default function Die(props) {
  const styles = {
    backgroundColor: props.isHeld ? "#59E391" : "white"
  }

  let dots = []
  for(let i=0; i<props.value; i++) {
    dots.push(<span className="die-dot"></span>)
  }

  return(
    <div onClick={props.holdDice} className={`die die-${props.value}`}style={styles}>
      {dots}
    </div>
  )
}