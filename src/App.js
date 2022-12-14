import { useState, useEffect } from "react";

import Editor from "./components/Editor";
import "./App.css";
import Split from "react-split";
import Panels from "./components/Panels";
import "./styles/styles.css";
import { AiFillPlayCircle } from "react-icons/ai";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [value, setValue] = useState("hello world");
  const [instructionText, setInstructionText] = useState("Enter Instructions");
  const [testCases, setTestCases] = useState();
  const [editorValue, setEditorValue] = useState("");
  const [examples, setExamples] = useState([
    "example 1",
    "example 2",
    "example 3",
    "example 4",
  ]);
  // Edward's local mock postman server
  var testServer = "https://b7892dbe-8db6-4ff4-9fe4-7b3bc05cab60.mock.pstmn.io";

  const submitCodeHandler = () => {
    console.log(editorValue);
    if (value) {
      const newComment = {
        createdBy: "edtest",
        description: editorValue,
        userId: 1,
      };
      fetch(testServer + "/submit", {
        method: "POST",
        headers: new Headers({
          Accept: "application/json",
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(newComment),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Data recieved post");
          console.log(data);
          setTestCases(data);
          setLoading(false);
          setError(null);
        })
        .catch((error) => {
          setLoading(false);
          setError("Something went wrong, please try again later.");
        });
    }
  };

  const getTestResults = () => {
    fetch(
      // Edward's local mock postman server
      testServer + "/results"
    )
      .then((data) => {
        data.json();
      })
      .then((data) => {
        console.log("test results recieved get");
        console.log(data);
        setTestCases(data);
        setLoading(false);
        setError(null);
      })
      .catch((error) => {
        setLoading(false);
        setError("Something went wrong, please try again later.");
      });
  };

  const testcases = [
    { key: 1, number: 1, result: "Pass", stdout: "" },
    { key: 2, number: 2, result: "Fail", stdout: "Segmentation Fault" },
    { key: 3, number: 3, result: "Pass", stdout: "" },
    { key: 4, number: 4, result: "Pass", stdout: "" },
    { key: 5, number: 5, result: "Pass", stdout: "" },
    { key: 6, number: 6, result: "Fail", stdout: "Segmentation Fault" },
    { key: 7, number: 7, result: "Pass", stdout: "" },
    { key: 8, number: 8, result: "Pass", stdout: "" },
  ];
  const getMockTestResults = () => {
    setTestCases(testcases);
    console.log("mock test results set");
  };

  const getInstructions = () => {
    fetch("http://localhost:3333/instructions")
      .then((data) => {
        data.json();
      })
      .then((data) => {
        //console.log('instructions recieved get')
        console.log(data);
        setInstructionText(data);
        setLoading(false);
        setError(null);
      })
      .catch((error) => {
        setLoading(false);
        setError("Something went wrong, please try again later.");
      });
  };

  useEffect(() => getInstructions(), []);

  return (
    <div className="App">
      <div className="my-4 font-sans text-2xl font-bold">
        Unison Live Code Editor
      </div>
      <Panels
        setEditorValue={setEditorValue}
        instructions={instructionText}
        examples={examples}
        testCases={testCases}
      />
      <button
        type="button"
        className="btn right-60 bottom-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={submitCodeHandler}
      >
        Run Code
      </button>
      <button
        type="button"
        className="btn right-30 bottom-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded whitespace-nowrap"
        onClick={getMockTestResults}
      >
        Submit <AiFillPlayCircle />
      </button>
    </div>
  );
}

export default App;
