import { gql, useMutation, useQuery } from '@apollo/client';
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

function App() {
	//perform a graphql operation
	const { data, loading, error } = useQuery(GET_TODOS)
	const [toggleTodo] = useMutation(TOGGLE_TODO);

	if(loading) return <div>Loading todos...</div>
	if(error) return <div>Error fetching todos.</div>

	async function handleToggleTodo(todo) {
		const data = await toggleTodo({ variables: { id: todo.id, done: !todo.done } })
		console.log(data);
	}

	return (
		<div className="vh-100 code flex flex-column items-center bg-purple white pa3 f1-1">
			<h1 className="f2-1">GraphQL checklist {" "}
				<span role="img" aria-label="checkmark">✔</span>
			</h1>
			{/* todo form */}
			<form className="mb3">
				<input className="pa2 f4 b--dashed" type="text" placeholder="Write your todo" />
				<button className="pa2 f4 bg-green" type="submit">Create</button>
			</form>

			{/* Todo list */}
			<div className="flex items-center justify-center flex-column">
				{data.todos.map(todo => (
					<p onDoubleClick={() => handleToggleTodo(todo)} key={todo.id}>
						<span className={`pointer list pa1 f3 ${todo.done && "strike"}`}>{todo.text}</span>
						<button className="bg-transparent bn f4">
							<span className="red">&times;</span>
						</button>
					</p>
				))}
			</div>
		</div>
	);
}

export default App;
