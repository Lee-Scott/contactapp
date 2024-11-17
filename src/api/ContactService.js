import axios from "axios";

const API_URL = "http://localhost:8080/contacts";
const CHAT_API_URL = "http://localhost:8080/chat";

export async function saveContact(contact) {
    console.log("Saving contact:", contact);  // Console log added
    return await axios.post(API_URL, contact);
}

export async function getContacts(page = 0, size = 10) {
    console.log(`Fetching contacts with pagination: page=${page}, size=${size}`);  // Console log added
    return await axios.get(`${API_URL}?page=${page}&size=${size}`);
}

export async function getContact(id) {
    console.log(`Fetching contact with ID: ${id}`);  // Console log added
    return await axios.get(`${API_URL}/${id}`);
}

export async function updateContact(contact) {
    console.log("Updating contact:", contact);  // Console log added
    return await axios.post(API_URL, contact);
}

export async function updatePhoto(formData) {
    console.log("Updating photo with form data:", formData);  // Console log added
    return await axios.put(`${API_URL}/photo`, formData);
}

export async function deleteContact(id) {
    console.log(`Deleting contact with ID: ${id}`);  // Console log added
    return await axios.delete(`${API_URL}/${id}`);
}

export async function sendChatMessage(contactId, message) {
    try {
        console.log(`Sending chat message to contact ${contactId}: ${message}`);  // Console log added
        const response = await axios.post(`${CHAT_API_URL}/${contactId}`, {
            message: message
        });
        return response.data;  // Optionally handle the response here
    } catch (error) {
        console.error("Error sending chat message:", error);  // Console log added
        throw error;  // Handle error as needed
    }
}
