const DATABASE_URL = "https://raw.githubusercontent.com/Lawakplerkah/Security-/main/allowed.json"; 
const GITHUB_REPO = "Lawakplerkah/Security-";
const FILE_PATH = "allowed.json";
const GITHUB_TOKEN = "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"; // Ganti dengan token GitHub Anda

// Ambil data user dan session dari GitHub
async function getUsers() {
  try {
    const response = await axios.get(DATABASE_URL);
    const data = response.data;
    if (data) {
      displayUsers(data.users);
      displaySessions(data.sessions);
    } else {
      alert("No data found.");
    }
  } catch (error) {
    alert("Failed to fetch users from GitHub!");
    console.error(error);
  }
}

// Menampilkan data users di tabel
function displayUsers(users) {
  const tableBody = document.querySelector("#userTable tbody");
  tableBody.innerHTML = ""; // Kosongkan tabel sebelum diisi

  users.forEach((user, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${user.username}</td>
      <td>${user.phoneNumber}</td>
      <td>
        <button class="update-button" onclick="updateUser(${index})">Update</button>
        <button class="delete-button" onclick="deleteUser(${index})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Menampilkan data sessions di tabel
function displaySessions(sessions) {
  const tableBody = document.querySelector("#sessionTable tbody");
  tableBody.innerHTML = ""; // Kosongkan tabel sebelum diisi

  sessions.forEach((session, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${session.username}</td>
      <td>${session.phoneNumber}</td>
      <td>
        <button class="update-button" onclick="updateSession(${index})">Update</button>
        <button class="delete-button" onclick="deleteSession(${index})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Update user data di GitHub
async function updateUser(index) {
  const newPhoneNumber = prompt("Enter new phone number:");

  if (newPhoneNumber) {
    try {
      const response = await axios.get(DATABASE_URL);
      const data = response.data;

      // Update user phone number
      data.users[index].phoneNumber = newPhoneNumber;

      await updateGitHub(data);
      alert("User updated successfully!");
      getUsers(); // Refresh user data
    } catch (error) {
      alert("Failed to update user!");
      console.error(error);
    }
  }
}

// Delete user data dari GitHub
async function deleteUser(index) {
  if (confirm("Are you sure you want to delete this user?")) {
    try {
      const response = await axios.get(DATABASE_URL);
      const data = response.data;

      // Hapus data user
      data.users.splice(index, 1);

      await updateGitHub(data);
      alert("User deleted successfully!");
      getUsers(); // Refresh user data
    } catch (error) {
      alert("Failed to delete user!");
      console.error(error);
    }
  }
}

// Update session data di GitHub
async function updateSession(index) {
  const newPhoneNumber = prompt("Enter new phone number:");

  if (newPhoneNumber) {
    try {
      const response = await axios.get(DATABASE_URL);
      const data = response.data;

      // Update session phone number
      data.sessions[index].phoneNumber = newPhoneNumber;

      await updateGitHub(data);
      alert("Session updated successfully!");
      getUsers(); // Refresh session data
    } catch (error) {
      alert("Failed to update session!");
      console.error(error);
    }
  }
}

// Delete session data dari GitHub
async function deleteSession(index) {
  if (confirm("Are you sure you want to delete this session?")) {
    try {
      const response = await axios.get(DATABASE_URL);
      const data = response.data;

      // Hapus data session
      data.sessions.splice(index, 1);

      await updateGitHub(data);
      alert("Session deleted successfully!");
      getUsers(); // Refresh session data
    } catch (error) {
      alert("Failed to delete session!");
      console.error(error);
    }
  }
}

// Mengupdate data ke GitHub
async function updateGitHub(updatedData) {
  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`;

  try {
    const fileResponse = await axios.get(apiUrl, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    const sha = fileResponse.data.sha;

    const content = Buffer.from(JSON.stringify(updatedData, null, 2)).toString('base64');

    await axios.put(apiUrl, {
      message: "Update user and session data",
      content,
      sha
    }, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
  } catch (error) {
    alert("Failed to update database on GitHub.");
    console.error(error);
  }
}

// Initial data load
getUsers();
