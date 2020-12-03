import { gql, useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import './App.css';

//gql parses the queries
const GET_TODOS = gql `
	query getTodos {
		todos {
		done
		id
		text
		}
	}
`

//to update todo status, used in useMutation()
const TOGGLE_TODO = gql `
	mutation toggleTodo($id: uuid!, $done: Boolean!) {
		update_todos(where: {id: {_eq: $id}}, _set: {done: $done}) {
			returning {
				done
				id
				text
			}
		}
	}
`

const ADD_TODO = gql `
	mutation addTodo($text : String!) {
		insert_todos(objects: {text: $text, done: false}) {
			returning {
				done
				id
				text
			}
		}
	}
`

const DELETE_TODO = gql `
	mutation deleteTodo($id : uuid!) {
		delete_todos(where: { id: { _eq: $id }}) {
			returning {
				done
				id
				text
			}
		}
	}
`

function App() {
	const [todoText, setTodoText] = useState("");
	//perform a graphql operation
	//Get todo
	const { data, loading, error } = useQuery(GET_TODOS)
	//Toggle todo
	const [toggleTodo] = useMutation(TOGGLE_TODO);
	//Add todo
	const [addTodo] = useMutation(ADD_TODO, {
		onCompleted: () => setTodoText('')
	});
	//Delete todo
	const [deleteTodo] = useMutation(DELETE_TODO);

	if(loading) return <div>Loading todos...</div>
	if(error) return <div>Error fetching todos.</div>

	async function handleToggleTodo(todo) {
		const data = await toggleTodo({ variables: { id: todo.id, done: !todo.done } })
		console.log("Toggled todo " + data);
	}

	async function handleAddTodo(event) {
		event.preventDefault();
		if(!todoText.trim()) return;
		const data = await addTodo(
			{ 
				variables: { text: todoText },
				//Add todo dynamically, otherwise a page reload is required
				refetchQueries: [
					{ query: GET_TODOS }
				]
			}
		)
		console.log("Added todo " + data);
	}

	async function handleDeleteTodo({ id }) {
		const isConfirmed = window.confirm("Do you want to delete?");
		if(isConfirmed) {
			const data = await deleteTodo({ 
				variables : { id },
				update: cache => {
					const prevData = cache.readQuery({ query: GET_TODOS })
					const newTodos = prevData.todos.filter(todo => todo.id !== id);
					cache.writeQuery({ query: GET_TODOS, data: { todos: newTodos } })
				} 
			});
			console.log("Deleted todo " + data);
		}
	}

	return (
		<div className="vh-100 code flex flex-column items-center bg-purple white pa3 f1-1">
			<h1 className="f2-1">GraphQL checklist {" "}
				<span role="img" aria-label="checkmark">✔</span>
			</h1>
			{/* todo form */}
			<form onSubmit={handleAddTodo} className="mb3">
				<input onChange={event => setTodoText(event.target.value)} value={todoText} className="pa2 f4 b--dashed" type="text" placeholder="Write your todo" />
				<button className="pa2 f4 bg-green" type="submit">Create</button>
			</form>

			{/* Todo list */}
			<div className="flex items-center justify-center flex-column">
				{data.todos.map(todo => (
					<p onDoubleClick={() => handleToggleTodo(todo)} key={todo.id}>
						<span className={`pointer list pa1 f3 ${todo.done && "strike"}`}>{todo.text}</span>
						<button className="bg-transparent bn f4">
							<span onClick={() => handleDeleteTodo(todo)} className="red">&times;</span>
						</button>
					</p>
				))}
			</div>
		</div>
	);
}

export default App;
