import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getContact, updatePhoto, sendChatMessage, deleteContact } from '../api/ContactService';
import { toastError, toastSuccess } from '../api/ToastService';
import { useNavigate } from 'react-router-dom';

const ContactDetail = ({ updateContact, updateImage, onContactUpdated }) => {
    const navigate = useNavigate();
    const inputRef = useRef();
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
        setShowChat(!showChat);
    };

    const sendMessage = async (message) => {
        console.log(`Sending message: ${message}`);
        try {

            await sendChatMessage(contact.id, message);
            setMessages((prevMessages) => [
                ...prevMessages,
                { from: 'Me', text: message }
            ]);

            // Wait for a reply from the bot
            setTimeout(async () => {
                const response = await sendChatMessage(contact.id, message);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { from: contact.name, text: ` ${response}` }
                ]);
            }, 1000);
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

    useEffect(() => {
        console.log('ContactDetail mounted');
        fetchContact(id);
    }, []);

    return (
        <>
            <Link to={'/contacts'} className='link'><i className='bi bi-arrow-left'></i> Back to list</Link>
            <div className='profile'>
                <div className='profile__details'>
                    <img src={contact.photoUrl} alt={`Profile photo of ${contact.name}`} />
                    <div className='profile__metadata'>
                        <p className='profile__name'>{contact.name}</p>
                        <button onClick={toggleChat} className='btn me-3'>
                            <i className='bi bi-chat'></i> Chat with {contact.name}
                        </button>
                        <button onClick={selectImage} className='btn change-photo-button'>
                            <i className='bi bi-camera'></i> Change Photo
                        </button>

                    </div>
                </div>

                {showChat && (
                    <div className="chat-box">
                        <div className="messages">
                            {messages.map((msg, index) => (
                                <div key={index} className={`message ${msg.from === 'Me' ? 'me' : 'contact'}`}>
                                    <p><strong>{msg.from === 'Me' ? 'Me' : contact.name}:</strong> {msg.text}</p>
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
};

export default ContactDetail;
