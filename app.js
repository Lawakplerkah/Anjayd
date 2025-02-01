const DATABASE_URL = "https://raw.githubusercontent.com/Lawakplerkah/Security-/main/allowed.json"; 
const GITHUB_REPO = "Lawakplerkah/Security-";
const FILE_PATH = "allowed.json";
const GITHUB_TOKEN = "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"; // Ganti dengan token GitHub Anda

// Fungsi untuk mendapatkan data dari GitHub
async function getData() {
    try {
        const response = await axios.get(DATABASE_URL);
        const data = response.data;

        if (data && data.users) {
            displayData(data.users);
        } else {
            alert("No data found.");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data.");
    }
}

// Fungsi untuk menampilkan data ke dalam tabel
function displayData(users) {
    const tableBody = document.querySelector("#userTable tbody");
    tableBody.innerHTML = ""; // Reset table

    users.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.password}</td>
            <td>${user.phoneNumber || "N/A"}</td>
            <td>
                <button class="button" onclick="editUser('${user.username}')">Edit</button>
                <button class="button" onclick="deleteUser('${user.username}')">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Fungsi untuk mengedit user
function editUser(username) {
    const newPhone = prompt("Enter new phone number:");
    if (newPhone) {
        updateUser(username, newPhone);
    }
}

// Fungsi untuk mengupdate data user ke GitHub
async function updateUser(username, newPhone) {
    try {
        const response = await axios.get(DATABASE_URL);
        const data = response.data;

        const userIndex = data.users.findIndex(user => user.username === username);
        if (userIndex !== -1) {
            data.users[userIndex].phoneNumber = newPhone;

            // Update data di GitHub
            await updateGitHub(data);
            alert("User updated successfully.");
            getData(); // Refresh data
        }
    } catch (error) {
        console.error("Error updating user:", error);
        alert("Failed to update user.");
    }
}

// Fungsi untuk menghapus user
async function deleteUser(username) {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
        try {
            const response = await axios.get(DATABASE_URL);
            const data = response.data;

            // Filter out the user to delete
            data.users = data.users.filter(user => user.username !== username);

            // Update data di GitHub
            await updateGitHub(data);
            alert("User deleted successfully.");
            getData(); // Refresh data
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user.");
        }
    }
}

// Fungsi untuk memperbarui data ke GitHub
async function updateGitHub(updatedData) {
    const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`;

    try {
        // Ambil sha dari file yang ada
        const fileResponse = await axios.get(apiUrl, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });
        const sha = fileResponse.data.sha;

        // Encode data ke base64
        const content = btoa(unescape(encodeURIComponent(JSON.stringify(updatedData, null, 2))));

        // Kirim update ke GitHub
        await axios.put(apiUrl, {
            message: "Update user data",
            content,
            sha
        }, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });

        console.log("Data updated successfully on GitHub!");
    } catch (error) {
        console.error("Error updating GitHub:", error);
        alert("Failed to update GitHub.");
    }
}

// Panggil fungsi getData ketika halaman dimuat
window.onload = getData;
