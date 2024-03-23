import React, { useEffect, useState } from "react";
import TodoInput from "./TodoInput";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Heading,
} from "@chakra-ui/react";
import axios from "axios";
const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTodo, setEditedTodo] = useState({
    title: "",
    assignedTo: "",
    completionDateTime: "",
  });
  const [status, setStatus] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  //   filter and sort states
  const [filterAssignedTo, setFilterAssignedTo] = useState("default");
  const [sortDateTime, setSortDateTime] = useState("default");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  useEffect(() => {
    getData(filterAssignedTo, sortDateTime);
  }, [filterAssignedTo, sortDateTime, page]);

 
//   async function getData(filterAssignedTo, sortDateTime, page) {
//     try {
//       let url = `http://localhost:8080/todos?_page=${page}&_limit=${limit}`;

//       // Collect query parameters
//       const queryParams = [];
//       if (filterAssignedTo !== "default") {
//         queryParams.push(`assignedTo=${filterAssignedTo}`);
//       }
//       if (sortDateTime !== "default") {
//         queryParams.push(`_sort=completionDateTime&_order=${sortDateTime}`);
//       }

//       // Append query parameters to the URL if there are any
//       if (queryParams.length > 0) {
//         url += `?${queryParams.join("&")}`;
//       }

//       console.log(url);

//       let res = await axios.get(url);
//       setTodos(res.data);
//     } catch (error) {
//       console.log(error);
//     }
//   }

  // to edit data

  // Handle edit click
  async function getData(filterAssignedTo, sortDateTime, page) {
    try {
      let url = `http://localhost:8080/todos`;
  
      // Construct query parameters
      const queryParams = [];
      if (filterAssignedTo !== "default") {
        queryParams.push(`assignedTo=${filterAssignedTo}`);
      }
      if (sortDateTime !== "default") {
        queryParams.push(`_sort=completionDateTime&_order=${sortDateTime}`);
      }
      if (page) {
        queryParams.push(`_page=${page}`);
      }
      if (limit) {
        queryParams.push(`_limit=${limit}`);
      }
  
      // Append query parameters to the URL if there are any
      if (queryParams.length > 0) {
        url += `?${queryParams.join("&")}`;
      }
  
      console.log(url);
  
      let res = await axios.get(url);
      setTodos(res.data);
    } catch (error) {
      console.log(error);
    }
  }
  
  
  
  const handleEditClick = (todo) => {
    setEditingTodo(todo);
    setIsOpen(true);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTodo({
      ...editedTodo,
      [name]: value,
    });
  };

  // Handle patch request when editing and submit
  async function handleSubmit() {
    try {
      let res = await axios.patch(
        `http://localhost:8080/todos/${editingTodo.id}`,
        editedTodo
      );

      getData();
      setIsEditing(false), setIsOpen(false);
      setEditedTodo({
        ...editedTodo,
        title: "",
        assignedTo: "",
        completionDateTime: "",
      });

      setEditingTodo(null);
    } catch (error) {
      console.log(error);
    }
  }

  //  Delete request
  async function handleDelete(id) {
    try {
      let res = await axios.delete(`http://localhost:8080/todos/${id}`);
      getData();
    } catch (error) {
      console.log(error);
    }
  }

  // patch request with to toggle status
  //   async function handleStatus(id) {
  //     try {
  //       const updateTodo = todos.find((todo) => todo.id === id);
  //       updateTodo.status = !updateTodo.status;
  //       let res = await axios.patch(`http://localhost:8080/todos/${id}`, {
  //         status: updateTodo.status,
  //       });
  //       setStatus(!status);
  //       getData();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  async function handleStatus(id) {
    try {
      // Find the todo item by ID
      const updatedTodo = todos.find((todo) => todo.id === id);

      // Toggle the status
      updatedTodo.status = !updatedTodo.status;

      // Send the updated status to the backend
      let res = await axios.patch(`http://localhost:8080/todos/${id}`, {
        status: updatedTodo.status ? "completed" : "pending", // Sending the updated status value
      });

      // Update the todos state with the updated data
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box>
      <TodoInput todos={todos} setTodos={setTodos} />

      <br />
      <br />
      <Heading textAlign="center">Todo List</Heading>
      <FormControl w="20%">
        <FormLabel>Filter By Assigned To</FormLabel>
        <Select
          value={filterAssignedTo}
          onChange={(e) => setFilterAssignedTo(e.target.value)}
        >
          <option value="">---</option>
          <option value="john">john</option>
          <option value="rita">rita</option>
          <option value="bharti">bharti</option>
          <option value="deepak">deepak</option>
        </Select>
      </FormControl>

      <FormControl w="20%">
        <FormLabel>Sort By completion date & time</FormLabel>
        <Select
          value={sortDateTime}
          onChange={(e) => setSortDateTime(e.target.value)}
        >
          <option value="">---</option>
          <option value="asc">nearest date first </option>
          <option value="desc">farthest date first </option>
        </Select>
      </FormControl>

      {/* <Select name="" id="">
        Sort By Date and time
      </Select> */}
      <br />
      <Box w="80%" m="auto" display="grid" gap="10px">
        {todos.map((todo) => (
          <Box
            key={todo.id}
            style={{
              border: "1px solid black",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <p>{todo.id}</p>
            <p>{todo.title}</p>
            <p>{todo.assignedTo}</p>
            <p>{todo.completionDateTime}</p>
            <p onClick={() => handleStatus(todo.id)}>
              {todo.status ? "completed" : "pending"}
            </p>
            <Button colorScheme="blue" onClick={() => handleEditClick(todo)}>
              Edit
            </Button>
            <Button onClick={() => handleDelete(todo.id)}>Delete</Button>
          </Box>
        ))}

        <Button onClick={() => setPage((prev) => prev - 1)}>Prev</Button>
        <Button onClick={() => setPage((prev) => page + 1)}>Next</Button>
      </Box>

      {/* Modal to edit the todo */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Todo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                name="title"
                value={editedTodo.title}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Assigned To</FormLabel>
              <Select
                name="assignedTo"
                value={editedTodo.assignedTo}
                onChange={handleChange}
              >
                <option value="john">john</option>
                <option value="rita">rita</option>
                <option value="bharti">bharti</option>
                <option value="deepak">deepak</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Completion Date & Time</FormLabel>
              <Input
                type="datetime-local"
                name="completionDateTime"
                value={editedTodo.completionDateTime}
                onChange={handleChange}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Submit
            </Button>
            <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Todo;
