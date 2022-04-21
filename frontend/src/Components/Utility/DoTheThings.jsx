import React from 'react'

export default function DoTheThings(props) {

    const theThing = props.theThing;
    const theOtherThing = props.theOtherThing;

    const doTheThing = () => {
        if (!theThing){
            console.log("Nothing to do atm");
        } else {
            theThing();
        }
        
      }
    
    const doTheOtherThing = () => {
        if (!theOtherThing){
            console.log("STILL nothing to do atm");
        } else {
            theOtherThing();
        }
    }

  return (
    <div>
        <button onClick={doTheThing}>Do the thing</button>
        <button onClick={doTheOtherThing}>Do the OTHER thing</button>
    </div>
  )
}
