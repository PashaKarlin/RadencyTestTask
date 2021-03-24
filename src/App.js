import { parse } from 'papaparse';
import { useState } from 'react';
import './App.css';
import TableRow from './components/TableRow';

function App() {
  const [people, setPeople] = useState([])
  const [error, setError] = useState('')

  const Upload = async (e) => {
    const uploadedFile = e.target.files[0]
    if (uploadedFile.type === 'application/vnd.ms-excel') {
      const text = await uploadedFile.text()
      const result = parse(text, { header: true })
      setPeople(result.data)
      setError('')
    } else {
      alert(`You can upload only '.csv' files`)
    }
  }

  const renderTableItem = (person) => {
    return (
      <TableRow index={people.indexOf(person) + 1} person={person} setError={setError} />
    )
  }

  return (
    <div className="App">
      <div className="upload-btn-wrapper">
        <button className="btn">Upload file</button>
        <input type="file" name="myfile" onChange={Upload} />
      </div>
      {error !== ''
        ?
        <div className="alert alert-danger">
          <strong>Error!</strong> {error}
        </div>
        :
        <table className="table table-dark">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Full Name</th>
              <th scope="col">Phone</th>
              <th scope="col">Email</th>
              <th scope="col">Age</th>
              <th scope="col">Experience</th>
              <th scope="col">Yearly Income</th>
              <th scope="col">Has Children</th>
              <th scope="col">License states</th>
              <th scope="col">Expiration date</th>
              <th scope="col">License Number</th>
            </tr>
          </thead>
          <tbody>
            {people.map(renderTableItem)}
          </tbody>
        </table>
      }
    </div>
  );

}

export default App;
