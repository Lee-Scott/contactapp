import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getContact, updatePhoto, sendChatMessage, deleteContact, makeTwoContactsChat } from '../api/ContactService';
import { toastError, toastSuccess } from '../api/ToastService';
import { useNavigate } from 'react-router-dom';




const ContactDetail = ({ updateContact, updateImage, onContactUpdated }) => {
    const navigate = useNavigate();
    const inputRef = useRef();
    const [contactsList, setContactsList] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);

    const [contact, setContact] = useState({
        id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        title: '',
        status: '',
        photoUrl: ''
    });
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');  // Added inputValue state
    const { id } = useParams();

    const fetchContact = async (id) => {
        console.log(`Fetching contact with ID: ${id}`);
        try {
            const { data } = await getContact(id);
            setContact(data);
            toastSuccess('Contact retrieved');
        } catch (error) {
            console.error("Error fetching contact:", error);
            toastError(error.message);
        }
    };

    const toggleChat = () => {
        console.log(`Toggling chat, current state: ${showChat}`);

        if (!showChat) {
            fetchAndDisplayChat(contact.id, 'BOB_CONTACT_ID');
        }
        setShowChat(!showChat);
    };

    const sendMessage = async (message) => {
        if (!message.trim()) return; // Prevent sending empty messages
        console.log(`Sending message: ${message}`);

        try {
            // Append user's message to the chat
            setMessages((prevMessages) => [
                ...prevMessages,
                { from: 'Me', text: message }
            ]);

            // Clear the input field
            setInputValue('');

            // Send the user's message to the API and wait for the bot's response
            const response = await sendChatMessage(contact.id, message);

            // Append the bot's response to the chat
            setMessages((prevMessages) => [
                ...prevMessages,
                { from: contact.name, text: response }
            ]);
        } catch (error) {
            console.error("Error sending chat message:", error);
        }
    };



    const handleKeyDown = (e) => {
        //console.log(`Key pressed: ${e.key}`);
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(inputValue);
            setInputValue(''); // Clear input after sending
        }
    };

    const handleChange = (e) => {
        //console.log(`Input changed: ${e.target.name} = ${e.target.value}`);
        setInputValue(e.target.value);
    };

    const selectImage = () => {
        console.log('Selecting image...');
        inputRef.current.click();
    };

    const updatePhoto = async (file) => {
        console.log(`Updating photo with file: ${file.name}`);
        try {
            const formData = new FormData();
            formData.append('file', file, file.name);
            formData.append('id', id);
            await updateImage(formData);
            setContact((prev) => ({ ...prev, photoUrl: `${prev.photoUrl}?updated_at=${new Date().getTime()}` }));
            toastSuccess('Photo updated');
        } catch (error) {
            console.error("Error updating photo:", error);
            toastError(error.message);
        }
    };

    const onChange = (event) => {
        console.log(`Updating contact field: ${event.target.name} = ${event.target.value}`);
        setContact({ ...contact, [event.target.name]: event.target.value });
    };

    const onUpdateContact = async (event) => {
        event.preventDefault();
        console.log('Updating contact:', contact);
        await updateContact(contact);
        fetchContact(id);
        toastSuccess('Contact Updated');
    };

    const onDeleteContact = async (event) => {
        event.preventDefault();
        console.log(`Deleting contact with ID: ${id}`);
        await deleteContact(id);
        toastSuccess('Contact Deleted');
        onContactUpdated();
        navigate('/contacts');
    };

    const onSaveContact = async (event) => {
        event.preventDefault();
        console.log('Saving contact:', contact);
        await updateContact(contact);
        toastSuccess('Contact Saved');
        onContactUpdated();
        navigate('/contacts');
    };
    async function fetchAndDisplayChat(contactId1, contactId2) {
        try {
            console.log(`Attempting to fetch chat between ${contactId1} and ${contactId2}`); // Log the contact IDs
            const chatData = await makeTwoContactsChat(contactId1, contactId2);
            console.log("Chat data fetched:", chatData); // Log the fetched chat data

            if (chatData && chatData.messages) {
                console.log("Messages found:", chatData.messages); // Log the messages data
                setMessages(chatData.messages.map(msg => ({
                    from: msg.sender,
                    text: msg.content
                })));
            } else {
                console.error("Chat data or messages are undefined"); // Log if no messages found
            }
        } catch (error) {
            console.error("Error fetching chat:", error); // Log any error that occurs during fetch
        }
    }




    useEffect(() => {
        console.log('ContactDetail mounted');
        fetchContact(id);
    }, []);

    return (
        <>
            <Link to={'/contacts'} className='link'>
                <i className='bi bi-arrow-left'></i> Back to list
            </Link>
            <div className='profile'>
                <div className='profile__details'>
                    <img src={contact.photoUrl} alt={`Profile photo of ${contact.name}`} />
                    <div className='profile__metadata'>
                        <p className='profile__name'>{contact.name}</p>
                        <button onClick={toggleChat} className='btn me-3'>
                            <i className='bi bi-chat'></i> Chat with {contact.name}
                        </button>
    
                        {/* Dropdown button */}
                        <button 
                            className="btn me-3 dropdown-toggle" 
                            type="button" 
                            id="dropdownMenuButton" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                            onClick={toggleChat}
                        >
                            <i className='bi bi-chat'></i> Have {contact.name} Chat With Bob
                        </button>
    
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <li>
                                <button className="dropdown-item" onClick={() => alert('Chat with Bob')}>
                                    Bob
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item" onClick={() => alert('Chat with Linda')}>
                                    Linda
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item" onClick={() => alert('Chat with Tina')}>
                                    Tina
                                </button>
                            </li>
                        </ul>
    
                        <button onClick={selectImage} className='btn change-photo-button'>
                            <i className='bi bi-camera'></i> Change Photo
                        </button>
                    </div>
                </div>
    
                {showChat && (
                    <div className="chat-box">
                        <div className="messages">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`message ${msg.from === 'Me' ? 'me' : 'contact'}`}
                                >
                                    <p>
                                        <strong>{msg.from}:</strong> {msg.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <textarea
                            placeholder="Type a message"
                            value={inputValue}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                        />
                        <button onClick={() => sendMessage(inputValue)}>Send</button>
                    </div>
                )}
    
                <form style={{ display: 'none' }}>
                    <input type='file' ref={inputRef} onChange={(event) => updatePhoto(event.target.files[0])} name='file' accept='image/*' />
                </form>
    
                <div className='profile__settings'>
                    <div>
                        <form onSubmit={onUpdateContact} className="form">
                            <div className="user-details">
                                <input type="hidden" defaultValue={contact.id} name="id" required />
                                <div className="input-box">
                                    <span className="details">Name</span>
                                    <input type="text" value={contact.name} onChange={onChange} name="name" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Email</span>
                                    <input type="text" value={contact.email} onChange={onChange} name="email" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Phone</span>
                                    <input type="text" value={contact.phone} onChange={onChange} name="phone" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Address</span>
                                    <input type="text" value={contact.address} onChange={onChange} name="address" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Title</span>
                                    <input type="text" value={contact.title} onChange={onChange} name="title" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Status</span>
                                    <input type="text" value={contact.status} onChange={onChange} name="status" required />
                                </div>
                            </div>
                            <div className="form_footer">
                                <button onClick={onSaveContact} type="submit" className="btn">Save</button>
                                <button onClick={onDeleteContact} className="btn btn-danger">Delete Contact</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
    
export default ContactDetail;
