"use client";

import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/providers/AuthProvider";
import {
  Card,
  Typography,
  Chip,
  Input,
  Textarea,
  Button,
} from "@material-tailwind/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface Todo {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "completed";
  createdBy: string;
}

const TodoList = () => {
  const { user, token } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    dueDate: "",
    createdBy: user?._id || "",
  });
  const [loading, setLoading] = useState(false);

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTodo((prev) => ({ ...prev, [name]: value }));
  };

  const fetchTodos = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/user/todo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodos(data.todos);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async () => {
    console.log({ newTodo });
    if (
      newTodo.title.length < 1 ||
      newTodo.createdBy.length < 1 ||
      newTodo.description.length < 1 ||
      newTodo.dueDate.length < 1
    ) {
      alert("All fields are require");
      return;
    }

    try {
      const { data } = await axios.post(`${API_URL}/user/todo`, newTodo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTodos((prev) => [...prev, data.todo]);

      setNewTodo({
        createdBy: newTodo.createdBy,
        title: "",
        description: "",
        dueDate: "",
      });

      alert("New todo added!");
    } catch (error) {
      alert("Failed to add todo, please try again");
      console.error("Failed to add todo:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [token]);

  return (
    <div className="max-w-md md:max-w-lg mx-auto mt-8">
      <Card className="w-full">
        <form className="w-full flex flex-col ">
          <div className="mb-2">
            <Typography variant="h3" className="p-2 ">
              Title
            </Typography>
            <Input
              crossOrigin="anonymous"
              type="text"
              name="title"
              value={newTodo.title}
              onChange={handleFormChange}
              className="p-2 md:p-3 border rounded-lg"
            />
          </div>

          <div className="mb-2">
            <Typography className="p-2">Description</Typography>
            <Textarea
              name="description"
              value={newTodo.description}
              onChange={handleFormChange}
              placeholder="Task description"
              className="p-2 md:p-3 border rounded-lg"
            />
          </div>

          <div className="mb-2">
            <Typography className="p-2">Due Date/Time</Typography>
            <Input
              crossOrigin="anonymous"
              type="datetime-local"
              name="dueDate"
              value={newTodo.dueDate}
              onChange={handleFormChange}
              className="p-2 md:p-3 border rounded-lg mb-2"
            />
          </div>

          <Button
            onClick={handleAddTodo}
            className="bg-black text-white rounded-lg w-full mt-5 mb-3 p-2 cursor-pointer"
          >
            Add task
          </Button>
        </form>
      </Card>

      <Typography
        className="text-2xl forn-bold underline text-center my-3"
        variant="h3"
      >
        Todos
      </Typography>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-1">
          {todos.map((todo, idx) => (
            <Card
              className="rounded-tr-3xl rounded-bl-3xl bg-gray-400 flex flex-col mb-3"
              key={todo._id || idx}
            >
              <Typography className="p-2 font-bold text-xl">
                {todo.title}
              </Typography>
              <Typography className="p-2">
                {todo.description.length > 200
                  ? `${todo.description.substring(0, 100)}...`
                  : todo.description}
              </Typography>
              <div className="flex justify-between mb-2 p-2">
                <span className="text-sm">
                  {new Date(todo.dueDate).toLocaleString()}
                </span>
                <Button variant={"filled"} className="p-1 italic text-sm">
                  {todo.status || "pending"}
                </Button>
              </div>
            </Card>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
