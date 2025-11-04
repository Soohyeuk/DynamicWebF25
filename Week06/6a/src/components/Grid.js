import {useState, useEffect} from 'react'
import cx from 'classnames'
// import a css module file, meaning it's imported as an object, that can be used selectively
import styles from './UI.module.css'

// asset imports
import CardPattern from '../assets/moroccan-flower-dark.png'
import Bilbo from '../assets/bilbo-baggins.png'
import Cameron from '../assets/cameron-poe.png'
import Nikki from '../assets/nikki-cage.png'
import Pollux from '../assets/pollux-troy.png'

// apparently, src is a type string, that we dont need a quote around it to be a string
const cardImages =[{src: Bilbo}, {src: Cameron}, {src: Nikki}, {src: Pollux}] 

export default function Grid(props) {
  const [cards, setCards] = useState([])
  const [turns, setTurns] = useState(0)
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)

  // duplicate our deck and shuffle them and then store them in state
  const shuffleCards = () => {
    // creating exactly 2 duplicates of each card image, so we can have a matching pair
    const shuffledCards = [...cardImages, ...cardImages]
      //shuffling the cards using sort function that swaps items when a random number is positive
      .sort(() => Math.random() - 0.5)
      //give a unique id to each card
      .map((card) => ({...card, id: Math.round(Math.random() * 100000000)}))
    setCards(shuffledCards)
    setTurns(0)
  }

  const handleChoice = (card) => {
    // first, check if choice one is set; if it is,
    // assign the incoming card to choice two
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
    // what if both choices are selected?
    // we must compare them, but not in this handler
    // doing it here may run before state updates take effect
    // use useEffect so the check runs only when a choice changes
  }

  // useEffect(() => {}, []) // runs once on mount (initial render)
  useEffect(() => {
    // this is where we compare, after defining how choices are set
    // first, ensure both choices exist
    if (choiceOne && choiceTwo) {
      // if both exist, compare them to see if they match
      if (choiceOne.src === choiceTwo.src) {
        // cards (state) holds the full shuffled deck
        // map over them and mark matched items with matched: true
        setCards((prevCards) => {
          // copy each card; add the matched property for matching cards
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              console.log('a match!')
              // spread existing fields and add matched: true
              return {...card, matched: true}
            } else {
              return card
            }
          })
        })
        resetTurn()
        // otherwise, they do not match
      } else {
        console.log('not a match!')
        /// without this delay, the second card flip wouldn't be visible
        // because the check runs faster than the flip animation when they don't match
        setTimeout(() => resetTurn(), 2000)
      }
    }
  }, [choiceOne, choiceTwo])

  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    setTurns((prevTurns) => prevTurns + 1)
  }
  return (
    <>
      <button onClick={shuffleCards}>New Game</button>
      <p>Turns used: {turns}</p>
      <div className={styles.container}>
        <div className={styles.grid}>
          {cards.map((card) => (
            <Card
              card={card}
              key={card.id}
              handleChoice={handleChoice}
              flipped={card === choiceOne || card === choiceTwo || card.matched}
            />
          ))}
        </div>
      </div>
    </>
  )
}

// keep here for now; move to its own file after the demo
// const Card = (props) => {}
function Card(props) {
  // props now pass the whole card object
  const {card, handleChoice, flipped} = props
  // isActive would live in each card’s local state
  // const [isActive, setIsActive] = useState(false)

  const handleClick = () => {
    // setIsActive(!isActive)
    // setIsActive((current) => !current)
    handleChoice(card)
  }

  return (
    <div className={styles.flip_card}>
      <div
        className={cx(styles.flip_card_inner, {[styles.active]: flipped})}
        onClick={handleClick}
      >
        <div className={styles.flip_card_front}>
          <img src={CardPattern} alt="card front" />
        </div>
        <div className={styles.flip_card_back}>
          <img src={card.src} alt="card back" />
        </div>
      </div>
    </div>
  )
}
