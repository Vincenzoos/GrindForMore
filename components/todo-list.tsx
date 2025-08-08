'use client'

import { TodoItem } from "./todo-item";
import { TodoForm } from "./todo-form";
import { Todo } from "@/types/custom";
import { stat } from "fs";
import { useOptimistic } from "react";

export type Action = "delete" | "update" | "create"
export function todoReducer(
  state: Array<Todo>,
  {action, todo}: {action: Action, todo: Todo}
) {
  switch(action){
    // if action is delete
    case "delete":
      // update the state (array of todo) to exclude the record with specified id
      return state.filter(({id}) => id !== todo.id)
    
    case "update":
      // update the record with specified id to the new passed todo, if not found, keep it as it is
      return state.map(t => (t.id === todo.id ? todo : t))

    case "create":
      // add todo to the arrray
      return [todo, ...state]
    
    default:
      return state;
    } 

}

export type TodoOptimisticUpdate = (action: {
  action: Action;
  todo: Todo;
}) => void;


export function TodoList({ todos }: { todos: Array<Todo> }) {
  // useOptimistic hook
  // used to update UI with fake data after action performed 
  // to make user feel that their action is done successfully while waiting for server to process and respond
  // when server respond, replace fake data with actual one from server
  const [optimisticTodos, optimisticTodoUpdate] = useOptimistic(todos, todoReducer);
  return (
    <>
      <TodoForm optimisticUpdate={optimisticTodoUpdate}/>
      <div className="w-full flex flex-col gap-4">
        {/* {todos?.map((todo) => {
          return <TodoItem todo={todo} key={todo.id} />;
        })} */}
        {optimisticTodos?.map((todo) => {
          return <TodoItem optimisticUpdate={optimisticTodoUpdate} todo={todo} key={todo.id} />;
        })}
      </div>
    </>
  );
}
