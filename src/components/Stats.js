import React from "react";


export default function Stats(props) {

  return (
    <div className="stats-box">
      <h3 className="stat-bold">Number of rolls: <b>{props.rolls}</b></h3>
      <h3 className="stat-bold">Time spent: <b>{props.finalTime > 0 ? props.finalTime : props.time}</b> sec</h3>
    </div>
  )
}