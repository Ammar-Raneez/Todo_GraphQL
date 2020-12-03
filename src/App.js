import { gql, useQuery } from '@apollo/client';
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

//list todos
//add todps
//toggle todos
//delete todos
function App() {
	//perform a graphql operation
	const { data, loading, error } = useQuery(GET_TODOS)
	if(loading) return <div>Loading todos...</div>
	if(error) return <div>Error fetching todos.</div>

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
					<p key={todo.id}>
						<span className="pointer list pa1 f3">{todo.text}</span>
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
