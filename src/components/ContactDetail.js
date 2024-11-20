import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getContact, updatePhoto, sendChatMessage, deleteContact, makeTwoContactsChat, getContacts } from '../api/ContactService';
import { toastError, toastSuccess } from '../api/ToastService';
import Contact from "./Contact";


const ContactDetail = ({ updateContact, onContactUpdated }) => {
    const navigate = useNavigate();
    const { id } = useParams();

    // State for contact details
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

    // State for chat functionality
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');

    // State for contacts list pagination
    const [contacts, setContacts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [contactToChatWith, setContactToChatWith] = useState(null); // This will hold the contact to chat with

    const inputRef = useRef();

    // Fetch contact data by ID
    const fetchContact = async (id) => {
        try {
            const { data } = await getContact(id);
            setContact(data);
            toastSuccess('Contact retrieved');
        } catch (error) {
            console.error("Error fetching contact:", error);
            toastError(error.message);
        }
    };

    // Fetch all contacts with pagination
    const getAllContacts = async (page = 0, size = 6) => {
        try {
            setCurrentPage(page);
            const { data } = await getContacts(page, size);
            setContacts(data);
        } catch (error) {
            console.log(error);
            toastError(error.message);
        }
    };

    // Toggle chat window visibility
    const toggleChat = () => {
        if (contactToChatWith) {
            fetchAndDisplayChat(contact.id, contactToChatWith.id);
        } else {
            console.error("No contact selected for chat");
        }
        setShowChat(!showChat);
    };

    // Fetch and display chat messages between two contacts
    const fetchAndDisplayChat = async (contactId1, contactId2) => {
        try {
            const chatData = await makeTwoContactsChat(contactId1, contactId2);
            if (chatData && chatData.messages) {
                setMessages(chatData.messages.map(msg => ({
                    from: msg.sender,
                    text: msg.content
                })));
            } else {
                console.error("No chat messages found");
            }
        } catch (error) {
            console.error("Error fetching chat:", error);
        }
    };

    // Send a message in the chat
    const sendMessage = async (message) => {
        if (!message.trim()) return; // Prevent sending empty messages
        try {
            // Append user's message to the chat
            setMessages((prevMessages) => [...prevMessages, { from: 'Me', text: message }]);
            setInputValue(''); // Clear input after sending

            // Send message to the API and get bot's response
            const response = await sendChatMessage(contact.id, message);
            setMessages((prevMessages) => [...prevMessages, { from: contact.name, text: response }]);
        } catch (error) {
            console.error("Error sending chat message:", error);
        }
    };

    // Handle input change (e.g., text area for messages)
    const handleChange = (e) => setInputValue(e.target.value);

    // Handle sending message on pressing 'Enter'
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(inputValue);
        }
    };

    // Select new contact photo
    const selectImage = () => inputRef.current.click();

    // Update the contact's photo
    const updatePhotoHandler = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file, file.name);
            formData.append('id', id);
            await updatePhoto(formData);
            setContact(prev => ({ ...prev, photoUrl: `${prev.photoUrl}?updated_at=${new Date().getTime()}` }));
            toastSuccess('Photo updated');
        } catch (error) {
            console.error("Error updating photo:", error);
            toastError(error.message);
        }
    };

    // Handle form input change (for updating contact details)
    const onChange = (event) => {
        setContact(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    // Update the contact details
    const onUpdateContact = async (event) => {
        event.preventDefault();
        await updateContact(contact);
        fetchContact(id);
        toastSuccess('Contact Updated');
    };

    // Delete the contact
    const onDeleteContact = async () => {
        await deleteContact(id);
        toastSuccess('Contact Deleted');
        onContactUpdated();
        navigate('/contacts');
    };

    // Save the updated contact details
    const onSaveContact = async () => {
        await updateContact(contact);
        toastSuccess('Contact Saved');
        onContactUpdated();
        navigate('/contacts');
    };

    // Handle selecting a contact to chat with
    const handleSelectContactToChatWith = (contactItem) => {
        setContactToChatWith(contactItem);
    };

    // Fetch the contact and contacts list on component mount
    useEffect(() => {
        fetchContact(id);
        getAllContacts();
    }, [id]);

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
                        <button onClick={toggleChat} className="btn me-3">
                            <i className='bi bi-chat'></i> Chat with {contact.name}
                        </button>

                        {/* Dropdown for selecting a contact to chat with */}
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Have {contact.name} Chat With
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                {contacts.content?.map((contactItem) => (
                                    <a key={contactItem.id} className="dropdown-item" onClick={() => handleSelectContactToChatWith(contactItem)}>
                                        {contactItem.name}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <button onClick={selectImage} className='btn change-photo-button'>
                            <i className='bi bi-camera'></i> Change Photo
                        </button>
                    </div>
                </div>


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


                <form style={{ display: 'none' }}>
                    <input type='file' ref={inputRef} onChange={(e) => updatePhotoHandler(e.target.files[0])} name='file' accept='image/*' />
                </form>

                <div className='profile__settings'>
                    <form onSubmit={onUpdateContact} className="form">
                        <div className="user-details">
                            <input type="hidden" defaultValue={contact.id} name="id" required />
                            <div className="input-box">
                                <span className="details">Name</span>
                                <input type="text" value={contact.name} onChange={onChange} name="name" required />
                            </div>
                            <div className="input-box">
                                <span className="details">Email</span>
                                <input type="email" value={contact.email} onChange={onChange} name="email" required />
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
                            <button type="submit" className="btn">Save</button>
                            <button type="button" onClick={onDeleteContact} className="btn btn-danger">Delete Contact</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ContactDetail;
