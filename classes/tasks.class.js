class Task {
    constructor(title, description, assingto, date, priority, categorie, subtasks, subtasksdone, taskid, state) {
        this.title = title;
        this.description = description;
        this.assingto = assingto; /** Object */
        this.date = date;
        this.priority = priority;
        this.categorie = categorie;
        this.subtasks = subtasks; /** Array */
        this.suntasksdone = subtasksdone; /** Array */
        this.taskid = taskid; /** Number */
        this.state = state; /** TODO / IN-PROGRESS / AWAIT-FEEDBACK / DONE */ 
    }
}

export default Task;