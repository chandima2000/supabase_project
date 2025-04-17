import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { Session } from "@supabase/supabase-js";

export default function Tasks({session} : {session: Session}) {

  interface Task {
    id: number;
    title: string;
    description: string;
    created_at: string;
  };

  const [newTask, setNewTask] = useState({title: "", description: ""})
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newDescription, setNewDescription] = useState("");


  // Submit data
  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    
    const { error } = await supabase
                .from('tasks')   
                .insert({...newTask, email: session.user.email})
                .single();

    if (error){
        console.error("Error adding task : ", error.message)
        return;
        }

    setNewTask({title:"", description:""});

    };


    // Fetch data
    const fetchTasks = async () => {

        const { data, error } = await supabase
                    .from('tasks')
                    .select("*")
                    .order("created_at", {ascending: true})

        if (error){
            console.error("Error fetching tasks : ", error.message)
            return;
        }

        setTasks(data);

    };


    //delete Task
    const deleteTask = async (id: number) => {  

        const { error } = await supabase
                .from('tasks')   
                .delete()
                .eq("id",id);


        if (error){
            console.error("Error deleting tasks : ", error.message)
            return;
        }

    };

    //update Task
    const updateTask = async (id: number) => {  

        const { error } = await supabase
                .from('tasks')   
                .update({description: newDescription})
                .eq("id",id);


        if (error){
            console.error("Error updating tasks : ", error.message)
            return;
        }

    };


    useEffect( () => {
        fetchTasks();
    },[])


    //Supabase Subscriptions (Realtime Updates)
    useEffect(() => {
        const channel = supabase.channel("tasks-channel");
        channel
          .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "tasks" },
            (payload) => {
              const newTask = payload.new as Task;
              setTasks((prev) => [...prev, newTask]);
            }
          )
          .subscribe((status) => {
            console.log("Subscription: ", status);
          });
    }, []);


    
  return (
    <div className="max-w-xl mx-auto p-4">
    <h2 className="text-2xl font-semibold mb-4">Task Manager CRUD</h2>
  
    {/* Form to add a new task */}
    <form
        onSubmit={handleSubmit} 
        className="mb-4">
      <input
        type="text"
        placeholder="Task Title"
        onChange={(e) =>
          setNewTask((prev) => ({ ...prev, title: e.target.value }))
        }
        className="w-full mb-2 p-2 border border-gray-300 rounded"
      />
      <textarea
        placeholder="Task Description"
        onChange={(e) =>
          setNewTask((prev) => ({ ...prev, description: e.target.value }))
        }
        className="w-full mb-2 p-2 border border-gray-300 rounded"
      />
  
      
      <button 
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" 
        >
        Add Task
      </button>
    </form>
  
    List of Tasks
    <ul className="list-none p-0">
      {tasks.map((task, key) => (
        <li
          key={key}
          className="border border-gray-300 rounded p-4 mb-2"
        >
          <div>
            <h3 className="text-lg font-medium">{task.id} ) {task.title}</h3>
            <p className="mb-2">{task.description}</p>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <textarea
                placeholder="Update description..."
                onChange={(e) => setNewDescription(e.target.value)}
                className="p-2 border border-gray-300 rounded mb-2 sm:mb-0"
              />
              <button
                onClick={() => updateTask(task.id)}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 mb-2 sm:mb-0"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
  
  )
}

