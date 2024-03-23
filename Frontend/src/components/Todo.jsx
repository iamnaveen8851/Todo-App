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
  const [sortDateTime, setSortDateTime] = useState("asc");
  useEffect(() => {
    getData(filterAssignedTo, sortDateTime);
  }, [filterAssignedTo, sortDateTime]);

  //   to get data
  async function getData(filterAssignedTo, sortDateTime) {
    try {
      let url = `http://localhost:8080/todos`;

      if (filterAssignedTo !== "default") {
        url+= `?assignedTo=${filterAssignedTo}`
      }

      console.log(url);

      let res = await axios.get(url);

      setTodos(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  // to edit data

  // Handle edit click
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
  async function handleStatus(id) {
    try {
      const updateTodo = todos.find((todo) => todo.id === id);
      updateTodo.status = !updateTodo.status;
      let res = await axios.patch(`http://localhost:8080/todos/${id}`, {
        status: updateTodo.status,
      });
        setStatus(!status);
      getData();
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
              {status? "completed" : "pending"}
            </p>
            <Button colorScheme="blue" onClick={() => handleEditClick(todo)}>
              Edit
            </Button>
            <Button onClick={() => handleDelete(todo.id)}>Delete</Button>
          </Box>
        ))}
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
