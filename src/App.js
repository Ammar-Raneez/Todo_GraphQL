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
		<div className="app">
			<h1>GraphQL checklist</h1>
			{/* todo form */}
			<form>
				<input type="text" placeholder="Write your todo" />
				<button type="submit">Create</button>
			</form>

			{/* Todo list */}
			<div>
				{data.todos.map(todo => (
					<p key={todo.id}>
						<span>{todo.text}</span>
						<button>&times;</button>
					</p>
				))}
			</div>
		</div>
	);
}

export default App;
