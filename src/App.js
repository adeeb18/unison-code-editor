import { useState, useEffect } from 'react'

import Editor from './components/Editor'
import './App.css'
import Split from 'react-split'
import Panels from './components/Panels'
import './styles/styles.css'

function App() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [value, setValue] = useState('hello world')
  const [instructionText, setInstructionText] = useState('Enter Instructions')
  const [outputText, setOutputText] = useState('Enter Output here')
  const [editorValue, setEditorValue] = useState('')

  // Edward's local mock postman server
  var testServer = 'https://b7892dbe-8db6-4ff4-9fe4-7b3bc05cab60.mock.pstmn.io'

  const submitCodeHandler = () => {
    console.log(editorValue)
    if (value) {
      const newComment = {
        createdBy: 'edtest',
        description: editorValue,
        userId: 1,
      }
      fetch(testServer + '/submit', {
        method: 'POST',
        headers: new Headers({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(newComment),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Data recieved post')
          console.log(data)
          setOutputText(data)
          setLoading(false)
          setError(null)
        })
        .catch((error) => {
          setLoading(false)
          setError('Something went wrong, please try again later.')
        })
    }
  }

  const getTestResults = () => {
    fetch(
      // Edward's local mock postman server
      testServer + '/results'
    )
      .then((data) => {
        data.json()
      })
      .then((data) => {
        console.log('test results recieved get')
        console.log(data)
        setOutputText(data)
        setLoading(false)
        setError(null)
      })
      .catch((error) => {
        setLoading(false)
        setError('Something went wrong, please try again later.')
      })
  }

  const getInstructions = () => {
    fetch('http://localhost:3333/instructions')
      .then((data) => {
        data.json()
      })
      .then((data) => {
        //console.log('instructions recieved get')
        console.log(data)
        setInstructionText(data)
        setLoading(false)
        setError(null)
      })
      .catch((error) => {
        setLoading(false)
        setError('Something went wrong, please try again later.')
      })
  }

  useEffect(() => getInstructions(), [])

  return (
    <div className='App'>
      <div className='my-4 font-sans text-2xl font-bold'>
        Unison Live Code Editor
      </div>
      <Panels
        setEditorValue={setEditorValue}
        instructions={instructionText}
        outputText={outputText}
      />
      <button
        type='button'
        className='btn right-60 bottom-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        onClick={submitCodeHandler}
      >
        Submit
      </button>
      <button
        type='button'
        className='btn right-30 bottom-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        onClick={getTestResults}
      >
        Get Test Results
      </button>
    </div>
  )
}

export default App
