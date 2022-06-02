var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var getUserRepos = function(user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    // if request is good, changes to the then method
    fetch(apiUrl).then(function(response) {
        // response was successful
        if (response.ok) {
            response.json().then(function(data){
                displayRepos(data, user);
            });
        } else {
            alert("Error: GitHub User Not Found")
        }
    })
    // api's way of handling errors
    .catch(function(error) {
        // nptice this .catch() getting chained onto the end of the .then() method
        alert("Unable to connect to Github");
    }); 
};

var formSubmitHandler = function(event) {
    // stops the page from sending the form's data input data to a URL
    event.preventDefault();
    
    // nameInputEl gives us the value from <input> in html (what the user enters), and is stored in username 
    // .trim() is used if we accidentally leave a leading or trailing space in <input> i.e. " octocat" | "octocat "
    var username = nameInputEl.value.trim();

    if(username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }

};

var displayRepos = function(repos, searchTerm) {
    console.log(repos);
    console.log(searchTerm);

    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a container for each repo
        var repoEl = document.createElement("a");
        // creates href link that links to single-repo.html
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild(statusEl);

        // append container to the DOM
        repoContainerEl.appendChild(repoEl);
        }
    }; 

userFormEl.addEventListener("submit", formSubmitHandler);