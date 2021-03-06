import { Injectable, NotFoundException } from "@nestjs/common";
import { Task, TaskStatus } from "./tasks.model";
import { v4 as uuidv4 } from "uuid";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
        const { status, search } = filterDto;

        let tasks = this.getAllTasks();
        if (status) {
            tasks = tasks.filter(w => w.status === status);
        }
        if (search) {
            tasks = tasks.filter(w => 
                w.title.includes(search) || 
                w.description.includes(search)
            );
        }

        return tasks;
    }

    getTaskById(id: string): Task {
        const found = this.tasks.find(task => task.id === id);
        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        return found;
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto;

        const task: Task = {
            id: uuidv4(),
            title,
            description,
            status: TaskStatus.OPEN,
        };

        this.tasks.push(task);
        return task;
    }

    updateTaskStatus(id: string, status: TaskStatus): Task {
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    } 

    deleteTask(id: string): void {
        const found = this.getTaskById(id);
        if (found) {
            this.tasks.splice(this.tasks.indexOf(found), 1);
        }
    }
}
