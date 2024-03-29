import React, {useState, useEffect} from 'react';
import Table from "./Table";
import Form from "./Form";

function MyApp() {
    const [characters, setCharacters] = useState([]);

    useEffect(() => {
      fetchUsers()
        .then((res) => res.json())
        .then((json) => setCharacters(json["users_list"]))
        .catch((error) => { console.log(error); });
    }, [] );

    function removeOneCharacter(index) {
      const idToDelete = characters[index]._id;
      fetch(`http://localhost:8000/users/${idToDelete}`, {
        method: "DELETE",
      })
      .then(response => {
        if (response.status === 204) {
          const updated = characters.filter((character, i) => i !== index);
          setCharacters(updated);
        } else {
          throw new Error('Delete operation failed');
        }
      })
      .catch(error => console.log(error));
  }

    function postUser(person) {
        const promise = fetch("Http://localhost:8000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
    
        return promise;
    }

    function fetchUsers() {
        const promise = fetch("http://localhost:8000/users");
        return promise;
    }

    function updateList(person) { 
      postUser(person)
        .then(response => {
          if (response.status === 201) {
            return response.json();
          }
          throw new Error('User not created');
        })
        .then(newUser => setCharacters([...characters, newUser]))
        .catch(error => console.log(error));
    }

      return (
        <div className="container">
          <Table
            characterData={characters}
            removeCharacter={removeOneCharacter}
          />
          <Form handleSubmit={updateList} />
        </div>
      );
}

export default MyApp;