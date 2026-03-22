const input = document.getElementById('searchInput');
const button = document.getElementById('searchBtn');
const profileDiv = document.getElementById('profile');

// Click event
button.addEventListener("click", fetchUser);

// Enter key support
input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    fetchUser();
  }
});

async function fetchUser() {
  const username = input.value.trim();

  if (username === "") {
    profileDiv.innerHTML = `<p>Please enter a username</p>`;
    return;
  }

  profileDiv.innerHTML = `<p>Loading...</p>`;

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      throw new Error("User not found");
    }

    const data = await response.json();

    displayProfile(data);
    fetchRepos(username);

  } catch (error) {
    profileDiv.innerHTML = `<p>${error.message}</p>`;
  }
}

function displayProfile(user) {
  profileDiv.innerHTML = `
    <div class="card">
      <img src="${user.avatar_url}" width="100">

      <h2>${user.name ? user.name : user.login}</h2>
      <p>${user.bio ? user.bio : "No bio available"}</p>
      <div class="stats">
         <p><strong>Followers =</strong> ${user.followers}</p>
      <p><strong>Following =</strong> ${user.following}</p>
      <p><strong>Repositories =</strong> ${user.public_repos}</p>
      </div>

      <a href="${user.html_url}" target="_blank">View Profile</a>
    </div>
  `;
}

// Fetch repositories
async function fetchRepos(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos`);
    const repos = await response.json();

    let repoHTML = `<h3>Top Repositories 🚀</h3>`;

    repos.slice(0, 5).forEach(repo => {
      repoHTML += `
        <p>
          <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        </p>
      `;
    });

    profileDiv.innerHTML += repoHTML;

  } catch (error) {
    console.log("Repo fetch error");
  }
}