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
export async function makeTwoContactsChat(contactId1, contactId2) {
    try {
        
        console.log(`Fetching chat dynamically between contacts: ${contactId1} and ${contactId2}`); // Log for start of the fetch
        const response = await axios.get(`${CHAT_API_URL}/between/${contactId1}/${contactId2}`);
        
        console.log("Response received:", response); // Log the full response
        console.log("Response data:", response.data); // Log the response data

        // Parse the response data if it's in string format (assuming it's a plain text conversation)
        const parsedData = {
            messages: response.data.split('\n').map(line => {
                const [sender, content] = line.split(':');
                return sender && content ? { sender, content } : null;
            }).filter(msg => msg !== null)
        };

        // Check if the parsed data is structured correctly and return it
        if (parsedData && parsedData.messages.length > 0) {
            return parsedData;
        } else {
            console.error("Chat data or messages are undefined or improperly formatted.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching chat between contacts:", error); // Log the error
        throw error;
    }
}




