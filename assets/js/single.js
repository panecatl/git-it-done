var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

var getRepoName = function() {
    // grab repo name from url queryString
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];

    if (repoName) {
    // display repo name on the page
    repoNameEl.textContent = repoName;

    getRepoIssues(repoName);
    } 
    else {
        // if no repo was given, redirect to the homepage
        document.location.replace("./index.html");
    };
};

var getRepoIssues = function(repo) {
    var apiURL =  "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    // make get request to url
    fetch(apiURL).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                displayIssues(data);

            // check if api has paginated issues
            if (response.headers.get("link")) {
                displayWarning(repo);
            }
            });
        }
        else {
            // if npt succeddful, redirect to homepage
            document.location.replace("./index.html");
        }
    });
}


var displayIssues = function(issues) {
    // incase there are no open issues
    if (issues.length === 0) {
        issueContainerEl.textContent= "This repo has no open issues!"
        return;
    }

    // loop over given issues
    for (var i = 0; i < issues.length; i++) {
    // create a link element to take users to the issue on github
    var issueEl = document.createElement("a");
    issueEl.classList = "list-item flex-row justify-space-between align-center";
    issueEl.setAttribute("href", issues[i].html_url);
    issueEl.setAttribute("target", "_blank");

    // create span to hold issue title
    var titleEl = document.createElement("span");
    titleEl.textContent = issues[i].title;

    // append to container
    issueEl.appendChild(titleEl);

    // create a type element
    var typeEl = document.createElement("span");

    // check if issue is an actial issue or a pull request
    if (issues[i].pull_request) {
        typeEl.textContent = "(Pull request)";
    } else {
        typeEl.textContent = "(Issue)";
    }

    // append to container
    issueEl.appendChild(typeEl);

    // append to show on the screen through id in html
    issueContainerEl.appendChild(issueEl);
}
};

var displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues visit ";

    // to create href 
    var linkEl = document.createElement("a");
    // what is displayed on page
    linkEl.textContent = "See More Issues on GitHub.com";
    // creates the href to what is displayed on page ("See more issues on GitHub")
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    // opens the link in a blank page
    linkEl.setAttribute("target", "_blank");

    // append to warning container
    limitWarningEl.appendChild(linkEl);
};

getRepoName();