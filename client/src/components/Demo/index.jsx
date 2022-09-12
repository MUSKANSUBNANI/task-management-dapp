import { useState} from "react";
import useEth from "../../contexts/EthContext/useEth";

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
        allTasks.map(item=> console.log(item.id));
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
    const taskText = inputValue;
    
    const result= await state.contract.methods.addTask(taskText, isComplete).send({ from:state.accounts[0] });
  };
  
  const deleteTask = (key) => async() => {
    console.log(key);
    // Now we got the key, let's delete our task
    try {
      
        let completeTaskTx = await state.contract.methods.toggleCompleteTask(key).send({ from:state.accounts[0] });
        let allTasks = await state.contract.methods.getMyTasks().call({ from: state.accounts[0] });
        setTasks(allTasks);
      }
    catch(error) {
      console.log(error);
    }
  }

  const getAllTasksDiv =
      <button onClick={getAllTasks}>
        getAllmyTasks
      </button>


  const AddTasksDiv =
    <div>
      Add Task: <input type="text" name="task" value={inputValue} onChange={handleInputChange} />
      <button type="button" onClick={write}>Add new Task</button>
    </div>

  const ListTasksDiv = 
  tasks?
    <div>
      <h5> Click On Task To Mark It Complete</h5>
      <ul>
        {tasks.map(item=> 
        <li><button  onClick={ deleteTask(item.id)} >{item.taskText}</button></li>)
        }
      </ul>
    </div> 
    : 
    <div>
    </div>;

return (
  <div>
     <h1>Simple Task Management App</h1>
     <br/>
    <div>
      {
        getAllTasksDiv
      }
    </div>
    <br/>
    <div>
      {
        AddTasksDiv
      }
    </div>
    <br/>
    <div>
      {
        ListTasksDiv
      }
    </div>
  </div>
);
}

export default Demo;
