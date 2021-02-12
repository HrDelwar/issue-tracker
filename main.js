document.getElementById('issueInputForm').addEventListener('submit', (e) => {
  const issueDescription = document.getElementById('issueDescription');
  const assignedTo = document.getElementById('issueAssignedTo');
  if (!issueDescription.value || !isNaN(issueDescription.value)) {
    document.getElementById('error-message').style.display = 'block';
    document.getElementById('error-message').innerText = 'Please add a description name.';
  } else if(!assignedTo.value) {
    document.getElementById('error-message').style.display = 'none';
    document.getElementById('err-msg-assignTo').style.display = 'block';
    document.getElementById('err-msg-assignTo').innerText = 'Please add a assigned name.';
  }else{
    submitIssue(e);
  }
});

function submitIssue(e) {
  const getInputValue = id => document.getElementById(id).value;
  const description = getInputValue('issueDescription');
  const severity = getInputValue('issueSeverity');
  const assignedTo = getInputValue('issueAssignedTo');
  const id = Math.floor(Math.random() * 100000000) + '';
  let status = 'Open';

  const issue = { id, description, severity, assignedTo, status };
  let issues = [];
  if (localStorage.getItem('issues')) {
    issues = JSON.parse(localStorage.getItem('issues'));
  }
  issues.push(issue);
  localStorage.setItem('issues', JSON.stringify(issues));

  document.getElementById('issueInputForm').reset();
  fetchIssues();
  e.preventDefault();
}

const closeIssue = id => {
  let issues = JSON.parse(localStorage.getItem('issues'));
  const currentIssue = issues.find(issue => issue.id == id);
  currentIssue.status = 'Closed';
  localStorage.setItem('issues', JSON.stringify(issues));
  fetchIssues();
}

const deleteIssue = id => {
  const issues = JSON.parse(localStorage.getItem('issues'));
  const remainingIssues = issues.filter(issue => issue.id != id)
  localStorage.setItem('issues', JSON.stringify(remainingIssues));
  fetchIssues();
}

const fetchIssues = () => {
  document.getElementById('err-msg-assignTo').style.display = 'none';
  document.getElementById('error-message').style.display = 'none';
  const issues = JSON.parse(localStorage.getItem('issues'));
  const issuesList = document.getElementById('issuesList');
  issuesList.innerHTML = '';
  let totalIssueCount = 0;
  let openIssueCount = 0;
  for (var i = 0; i < issues.length; i++) {
    totalIssueCount += 1;
    const { id, description, severity, assignedTo, status } = issues[i];
    if (status == 'Open') {
      openIssueCount += 1;
    };
    issuesList.innerHTML += `<div class="well">
                              <h6>Issue ID: ${id} </h6>
                              <p><span class="label label-info"> ${status} </span></p>
                              <h3 class='${status == "Closed" ? "strike" : ""}'> ${description} </h3>
                              <p><span class="glyphicon glyphicon-time"></span> ${severity}</p>
                              <p><span class="glyphicon glyphicon-user"></span> ${assignedTo}</p>
                              <a href="#" onclick="closeIssue(${id})" class="btn btn-warning">Close</a>
                              <a href="#" onclick="deleteIssue(${id})" class="btn btn-danger">Delete</a>
                              </div>`;
  }
  document.getElementById('total-issue').innerText = totalIssueCount;
  document.getElementById('open-issue').innerText = openIssueCount;
  document.getElementById('closed-issue').innerText = totalIssueCount - openIssueCount;
}
