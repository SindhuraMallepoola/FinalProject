import asyncHandler from 'express-async-handler';
import taskModel from '../../models/auth/tasks/taskModel';


export const createTask = asyncHandler(async (req, res) => {
    try{
        const{title,description,dueDate,priority,status} = req.body;
        if(!title || title.trim() === ""){
            res.status(400).json({message:"Title is required"});
        }
        if(!description || description.trim() === ""){
            res.status(400).json({message:"Description is required"});
        }

        const task = new taskModel({
            title,
            description,
            dueDate,
            priority,
            status,
            completed,
            user:req.user._id
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {   
        console.log("Error in creating task", error.message);
        res.status(500).json({message:"error.message"});
    }
});

export const getTasks = asyncHandler(async (req, res) => {
    try{
        const userId = req.user._id;

        if(!userId){
            res.status(400).json({message:"User not found"});
        }

        const tasks = await taskModel.find({user:userId});
        res.status(200).json(
            {
                length:tasks.length,
                tasks,
            }
        );
    } catch (error) {
        console.log("Error in getting task", error.message);
        res.status(500).json({message:"error.message"});
    }
});

export const getTask= asyncHandler(async (req, res) => {
    try{
        const userId = req.user._id;
        const {id} = req.params;

        if(!id){
            res.status(400).json({message:"Task id is required"});
        }

        const task = await taskModel.findById(id);
        if(!task){
            res.status(404).json({message:"Task not found"});
        }
        if(!task.user.equals(userId)){
            res.status(401).json({message:"Not authorized to view this task"});
        }
        res.status(200).json(task);
    } catch (error) {
        console.log("Error in getting task", error.message);
        res.status(500).json({message:"error.message"});
    }
});

export const updateTask = asyncHandler(async (req, res) => {
    try{
        const userId = req.user._id;
        const {id} = req.params;
        const {title,description,dueDate,priority,status,completed} = req.body;

        if(!id){
            res.status(400).json({message:"Task id is required"});
        }

        const task = await taskModel.findById(id);
        if(!task){
            res.status(404).json({message:"Task not found"});
        }
        if(!task.user.equals(userId)){
            res.status(401).json({message:"Not authorized to update this task"});
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.dueDate = dueDate || task.dueDate;
        task.priority = priority || task.priority;
        task.status = status || task.status;
        task.completed = completed || task.completed;

        await task.save();
        res.status(200).json(task);
    } catch (error) {
        console.log("Error in updating task", error.message);
        res.status(500).json({message:"error.message"});
    }
}
);

export const deleteTask = asyncHandler(async (req, res) => {
    try{
        const userId = req.user._id;
        const {id} = req.params;

        if(!id){
            res.status(400).json({message:"Task id is required"});
        }

        const task = await taskModel.findById(id);
        if(!task){
            res.status(404).json({message:"Task not found"});
        }
        if(!task.user.equals(userId)){
            res.status(401).json({message:"Not authorized to delete this task"});
        }

        await taskModel.findByIdAndDelete(id);
        return res.status(200).json({message:"Task deleted successfully"});
    } catch (error) {
        console.log("Error in deleting task", error.message);
        res.status(500).json({message:"error.message"});
    }
}
);