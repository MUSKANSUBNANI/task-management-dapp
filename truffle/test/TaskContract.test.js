const TaskContract = artifacts.require('./TaskContract.sol')

contract('TaskContract', accounts => {
  let NUM_TOTAL_TASKS=5;
  let taskContract;
  let totalTasks;

  beforeEach(async function() {
    taskContract = await TaskContract.new({ from: accounts[0]});
    totalTasks =[];

    for(let i=0; i< NUM_TOTAL_TASKS; i++) {
      let task = {
        'taskText': 'Task number:- ' + i,
        'isComplete': false
      };

      await taskContract.addTask(task.taskText, task.isComplete);

      totalTasks.push(task);
    }
  })
  
  describe('Deployment', function(){
    it('deploys successfully', async function(){
      const address = await taskContract.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
      })
  });

  describe('AddTask', function() {
    it("should emit AddTask event", async function() {
      let task = {
        'taskText': 'New Task',
        'isComplete': false
      };
    
      const result = await taskContract.addTask(task.taskText, task.isComplete, { from: accounts[0] });
      const event = result.logs[0].args
      assert.equal(event.recipient, accounts[0]);
      assert.equal(event.taskId.toNumber(), NUM_TOTAL_TASKS);
    })
});

  describe('Total Task', function() {
    it("should return the correct number of total tasks", async function() {
      const tasksFromChain = await taskContract.getMyTasks();
      assert.equal(tasksFromChain.length, NUM_TOTAL_TASKS);
    })
  });

  describe("Complete Task", function() {
    it("should emit complete task event", async function(){
      const TASK_ID = 0;
      const TASK_COMPLETED = true;

    const result = await taskContract.toggleCompleteTask(TASK_ID);
    const event = result.logs[0].args
    
    assert.equal(event.taskId.toNumber(), 0);
    assert.equal(event.isCompleted, TASK_COMPLETED);
    })
  })

})