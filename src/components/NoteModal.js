import React, { useState} from "react"
import ReactModal from "react-modal"

const NoteModal = ({ isOpen, onSubmit, onRequestClose  }) => {
  const [noteText, setNoteText] = useState('')

  const handleNoteChange = (e) => {
    setNoteText(e.target.value)
  }

  const handleSubmit = () => {
    onSubmit(noteText);
    setNoteText('');
    onRequestClose();
  }

  return (
    <ReactModal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h3>New Note</h3>
      <textarea value={noteText} onChange={handleNoteChange} />
      <button onClick={handleSubmit}> Add Note</button>
      <button onClick={onRequestClose}>Cancel</button>
    </ReactModal>
  )
};

export default NoteModal