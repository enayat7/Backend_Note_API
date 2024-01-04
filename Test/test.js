const axios = require("axios")


const baseURL = 'http://localhost:8000/api/v1/users'; 

const api = axios.create({
  baseURL,
});

const mockUserData ={
  username: 'testuser',
  fullname: 'Test User',
  email: 'test@example.com',
  password: "testpassword",
};

const mockNoteData = {
  title: 'Test Note',
  content: 'This is a test note.',
};

describe('API Tests', () => {

  let userData
  let noteData
  let token

  it('should register a new user', async () => {

    try {
      const response = await api.post('/register', mockUserData);
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('message', 'Registration Success');
      expect(response.data).toHaveProperty('token');
      token = response.data.token
    } catch (error) {
      console.log(`error in registration  ${error}`)
    }
  });

  it('should login a user', async () => {

    try {
      const response = await api.post('/login', mockUserData);
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('message', 'Login Success');
      expect(response.data).toHaveProperty('token');
      token = response.data.token
      userData =response.data.user 
    } catch (error) {
      console.log(`error while in login  ${error}`)
    }
  });

  it('should add a new note', async () => {

    try {
      const response = await api.post('/addnote', mockNoteData, {
        headers: { Authorization: `Bearer ${token}`},
      });
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('message', 'content upload successfully');
      noteData = response.data.savedNote;
    } catch (error) {
      console.log(`error while adding new note  ${error}`)
    }
    
  });

  it('should get all notes', async () => {

    try {
      const response = await api.get('/allnotes', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('Notes');
      expect(Array.isArray(response.data.Notes)).toBe(true);
    } catch (error) {
      console.log(`error while getting  all notes  ${error}`)
    }
  });

  it('should get a note by ID', async () => {

   try {
    const noteId = noteData._id
    const response = await api.get(`/note/${noteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('Note');
   } catch (error) {
    console.log(`error while getting note by ID  ${error}`)
   }
  });

  it('should update a note', async () => {
    
    try {
      const updatedNoteData = {
        title: 'Updated Test Note',
        content: 'This is an updated test note.',
      };
      const noteId = noteData._id
      const response = await api.put(`/updatenote/${noteId}`,updatedNoteData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty("message", "Note updated successfully");
    } catch (error) {
      console.log(`error while updating a note ${error}`)
    }
  });


  it('should delete a note', async () => {
    try {
      const noteId = noteData._id
      const response = await api.delete(`/deletenote/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty("message", "Note deleted successfully");
    } catch (error) {
      console.log(`error in  while deleting a note ${error}`)
    }
  });


  it('should delete a User', async () => {
   try {
      const userId = userData._id
      // console.log(userData)
      const response = await api.delete(`/deleteuser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty("message", "User deleted successfully");
   } catch (error) {
      console.log(`error in  while deketin a user ${error}`)
   }
  });

});
