import './App.css';
import { createNote, deleteNote} from './mutations'
import { listNotes } from './queries'
import { withAuthenticator, Button, Text, Flex, Heading } from "@aws-amplify/ui-react";
import { useCallback, useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import NoteModal from './components/NoteModal';

function App( { signOut }) {
  const [notes, setNotes] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true)
  };

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const fetchNotes = useCallback(async () => {
    const result = await API.graphql({
      query: listNotes,
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    })

    console.log(result)
    setNotes(result.data.listNotes.items)
  }, [setNotes])

  const handleCreateNote = useCallback(async (modalText) => {
    await API.graphql({
      query: createNote,
      variables: { input: { text: modalText}},
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    })
    fetchNotes()
  }, [fetchNotes])

  const handleDeleteNote = useCallback(async (id) =>{
    await API.graphql({
      query: deleteNote, 
      variables: {input: {id: id} },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    })
    fetchNotes()
  }, [fetchNotes])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  return (
    <Flex direction={'column'}>
      <Flex justifyContent={'space-between'} >
        <Heading level={1}>My Notes</Heading>
        <Button onClick={signOut}>Sign Out</Button>
      </Flex>
      {notes.map(note => <Flex alignItems={'center'}>
       <Text>{note.text}</Text>
       <Button onClick={() => handleDeleteNote(note.id)}>Remove</Button>
      </Flex>)}
      <button onClick={openModal}> Create Note:</button>
      <NoteModal isOpen={isModalOpen} onRequestClose={closeModal} onSubmit={handleCreateNote} />
    </Flex>
  );
}

export default withAuthenticator(App);
