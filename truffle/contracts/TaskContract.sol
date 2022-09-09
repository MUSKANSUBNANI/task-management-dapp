// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
/**
 * @title Task Contract
 * @dev Store & retrieve value in a variable
 */
contract TaskContract {

    event TaskCreated(address recipient, uint taskId);
    event TaskCompleted(uint taskId, bool isCompleted);

    struct Task {
        uint id;
        address username;
        string taskText;
        bool isComplete;  
    }

    Task[] private tasks;

    // Mapping of Task id to the wallet address of the user
    mapping(uint256 => address) taskToOwner;

    // Method to be called by our frontend when trying to add a new Task
    function addTask(string memory taskText, bool isComplete) external {
        uint taskId = tasks.length;
        tasks.push(Task(taskId, msg.sender, taskText, isComplete));
        taskToOwner[taskId] = msg.sender;
        emit TaskCreated(msg.sender, taskId);
    }

    // Method to get only your Tasks
    function getMyTasks() external view returns (Task[] memory) {
        Task[] memory temporary = new Task[](tasks.length);
        uint counter = 0;
        for(uint i=0; i<tasks.length; i++) {
            if(taskToOwner[i] == msg.sender && tasks[i].isComplete == false) {
                temporary[counter] = tasks[i];
                counter++;
            }
        }

        Task[] memory result = new Task[](counter);
        for(uint i=0; i<counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }

    // Method to toggle completed task
    function toggleCompleteTask(uint taskId) external {
        if(taskToOwner[taskId] == msg.sender) {
            tasks[taskId].isComplete =! tasks[taskId].isComplete;
            emit TaskCompleted(taskId, tasks[taskId].isComplete);
        }
    }

}