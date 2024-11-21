import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getContact, updatePhoto, sendChatMessage, deleteContact, makeTwoContactsChat, getContacts } from '../api/ContactService';
import { toastError, toastSuccess } from '../api/ToastService';
import { useNavigate } from 'react-router-dom';

const ContactDetail = ({ updateContact, updateImage, onContactUpdated }) => {
    const navigate = useNavigate();
    const { id } = useParams();

    // State hooks for contact data and chat
    const [data, setData] = useState([]);
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
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef();

    const [contactToChatWith, setContactToChatWith] = useState(null);

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

    const getAllContacts = async (page = 0, size = 6) => {
        try {
            const { data } = await getContacts(page, size);
            setData(data);
        } catch (error) {
            toastError(error.message);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(inputValue);
            setInputValue('');
        }
    };

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const selectImage = () => {
        inputRef.current.click();
    };

    const updatePhoto = async (file) => {
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('id', id);
        await updateImage(formData);
        setContact((prev) => ({ ...prev, photoUrl: `${prev.photoUrl}?updated_at=${new Date().getTime()}` }));
        toastSuccess('Photo updated');
    };

    const onChange = (event) => {
        setContact({ ...contact, [event.target.name]: event.target.value });
    };

    const onUpdateContact = async (event) => {
        event.preventDefault();
        await updateContact(contact);
        fetchContact(id);
        toastSuccess('Contact Updated');
    };

    const onDeleteContact = async (event) => {
        event.preventDefault();
        await deleteContact(id);
        toastSuccess('Contact Deleted');
        onContactUpdated();
        navigate('/contacts');
    };

    const onSaveContact = async (event) => {
        event.preventDefault();
        await updateContact(contact);
        toastSuccess('Contact Saved');
        onContactUpdated();
        navigate('/contacts');
    };

    const sendMessage = async (message) => {
        if (!message.trim()) return;

        const newMessages = [...messages, { from: 'Me', text: message }];
        setMessages(newMessages);
        setInputValue('');

        try {
            const response = await sendChatMessage(contact.id, message);
            setMessages((prevMessages) => [
                ...prevMessages,
                { from: contact.name, text: response },
            ]);
        } catch (error) {
            console.error("Error sending chat message:", error);
        }
    };

    async function fetchAndDisplayChat(contactId1, contactId2) {
        try {
            console.log(`Fetching chat between ${contactId1} and ${contactId2}`);
            const chatData = await makeTwoContactsChat(contactId1, contactId2);
            console.log("Response data:", chatData); // Log the full response directly
    
            // Check if chatData.messages exists and is an array
            if (chatData && Array.isArray(chatData.messages)) {
                const filteredMessages = chatData.messages.map((msg) => ({
                    from: msg.sender,  // Change 'sender' to 'from'
                    text: msg.content, // Change 'content' to 'text'
                }));
                
                setMessages(filteredMessages); // Update the state with the filtered messages
            } else {
                console.error("Chat data or messages are undefined");
            }
        } catch (error) {
            console.error("Error fetching chat:", error);
        }
    }
    

    const handleSelectContactToChatWith = (contactItem) => {
        setContactToChatWith(contactItem);
    };

    useEffect(() => {
        if (contactToChatWith) {
            fetchAndDisplayChat(contact.id, contactToChatWith.id);
        }
        fetchContact(id);
        getAllContacts();
    }, [contactToChatWith]);

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
                        <div className="dropdown">
                            <button
                                className="btn btn-secondary dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Have {contact.name} Chat With
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                {Array.isArray(data.content) && data.content.length > 0 ? (
                                    data.content.map((contactItem) => (
                                        <li key={contactItem.id}>
                                            <a className="dropdown-item" onClick={() => handleSelectContactToChatWith(contactItem)}>
                                                {contactItem.name}
                                            </a>
                                        </li>
                                    ))
                                ) : (
                                    <li>No contacts available</li>
                                )}
                            </ul>
                        </div>

                        <button className='btn me-3'>
                            <i className='bi bi-chat'></i> Chat with {contact.name}
                        </button>

                        <button onClick={selectImage} className='btn change-photo-button'>
                            <i className='bi bi-camera'></i> Change Photo
                        </button>
                    </div>
                </div>

                <div className="chat-box">
                    <div className="messages">
                        {messages.length > 0 ? (
                            messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`message ${msg.from === 'Me' ? 'me' : 'contact'}`}
                                >
                                    <p>
                                        <strong>{msg.from}:</strong> {msg.text}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p>No messages yet.</p>
                        )}
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
};

export default ContactDetail;
