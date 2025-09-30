import Button from './components/Button'

const App = () => {
  //we prepped everything in button component, which is now handy to use it as a prop
  return (
    <>
      <div>
        <Button primary danger>
          Buy Now
        </Button>
      </div>
      <div>
        <Button secondary rounded>
          Secondary Button
        </Button>
      </div>
      <div>
        <Button danger>Delete</Button>
      </div>
      <div>
        <Button warning outline rounded>
          Are you sure?
        </Button>
      </div>
      <div>
        <Button success outline>
          Success
        </Button>
      </div>
    </>
  )
}

export default App
