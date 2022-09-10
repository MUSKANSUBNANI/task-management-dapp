import { useState} from "react";
import useEth from "../../contexts/EthContext/useEth";
import Task from "./Task";
function Demo() {
  const { state } = useEth();
  const [inputValue, setInputValue] = useState("");
  const [tasks,setTasks]=useState([]);

  const handleInputChange = e => {
    setInputValue(e.target.value);
    
  };

  const getAllTasks = async() => {
    try {
        const TaskContract = state.contract;
        console.log(TaskContract);
        let allTasks = await TaskContract.methods.getMyTasks().call({ from: state.accounts[0] });
        console.log(allTasks);
        setTasks(allTasks);
      } catch(error) {
      console.log(error);
    }
  }


  const write = async e => {
    if (e.target.tagName === "INPUT") {
      return;
    }
    if (inputValue === "") {
      alert("Please enter a value to write.");
      return;
    }

    const isComplete =false;
    console.log( inputValue);
    console.log( isComplete);
    const taskText = inputValue;
    
    const result= await state.contract.methods.addTask(taskText, isComplete).send({ from:state.accounts[0] });
    console.log(result);
  };
  
  const deleteTask = key => async() => {
    console.log(key);

    // Now we got the key, let's delete our tweet
    try {
      
        let deleteTaskTx = await state.contract.methods.deleteTask(key, true).send({ from:state.accounts[0] });
        let allTasks = await state.contract.methods.getMyTasks().call({ from: state.accounts[0] });
        setTasks(allTasks);
      }

    catch(error) {
      console.log(error);
    }
  }



  const demo =
  <div className="btns">

      <button onClick={getAllTasks}>
        getAllmyTasks
      </button>

      <div onClick={write} className="input-btn">

        write(<input
          type="text"
          placeholder="my new Task"
          value={inputValue}
          onChange={handleInputChange}
        />)

      </div>

      tasks ? <ul>
          {tasks.map(item=> 
            <Task 
              key={item.id} 
              taskText={item.taskText} 
              onClick={deleteTask(item.id)}
            />)
          }
      </ul>: <div></div>

    </div>;

return (

  <div className="demo">
    {
      demo
    }
  </div>
);

}

export default Demo;
