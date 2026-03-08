// Container
const allIssue = document.getElementById('all-Issue');

// Buttons
const buttons = document.querySelectorAll(".buttons .btn");

// Store all issues
let allIssuesData = [];

// Fetch issues
fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
  .then(res => res.json())
  .then(data => {
    allIssuesData = data.data;
    displayIssue(allIssuesData); // page load এ সব দেখাবে
  });

// Default All button blue
const allBtn = document.getElementById("all-btn");
allBtn.classList.add("bg-[#4A00FF]", "text-white");
allBtn.classList.remove("bg-white", "text-black");

// Button click
buttons.forEach(btn => {
  btn.addEventListener("click", () => {

    // Reset all buttons
    buttons.forEach(b => {
      b.classList.remove("bg-[#4A00FF]", "text-white");
      b.classList.add("bg-white", "text-black");
    });

    // Active clicked button
    btn.classList.add("bg-[#4A00FF]", "text-white");
    btn.classList.remove("bg-white", "text-black");

    // Filter issues
    let filteredIssues;
    if(btn.id === "all-btn") filteredIssues = allIssuesData;
    else if(btn.id === "open-btn") filteredIssues = allIssuesData.filter(issue => issue.status === "open");
    else if(btn.id === "closed-btn") filteredIssues = allIssuesData.filter(issue => issue.status === "closed");

    displayIssue(filteredIssues);
  });
});

// Display issues
function displayIssue(issues){
  allIssue.innerHTML = ""; // clear previous cards

  issues.forEach(issue => {

    const borderClass = issue.status === "open" ? "border-t-4 border-[#00A96E]" : "border-t-4 border-[#A855F7]";
    const statusImg = issue.status === "open" ? "./assets/Open-Status.png" : "./assets/closed.png";
    const priorityColor = issue.priority === "high" ? "bg-red-300" : issue.priority === "medium" ? "bg-yellow-300" : "bg-gray-300";

    // Labels
    let labelsHTML = "";
    if(issue.labels){
      issue.labels.forEach(label => {
        let labelColor = label === "bug" ? "bg-red-200 text-red-700" :
                         label === "enhancement" ? "bg-green-200 text-green-700" :
                         label === "help wanted" ? "bg-yellow-200 text-yellow-700" : "bg-gray-200";
        labelsHTML += `<div class="badge px-3 py-1 ${labelColor} rounded-full">${label}</div>`;
      });
    }

    const createdDate = issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : "";

    allIssue.innerHTML += `
      <div class="card bg-base-100 p-3 w-full shadow-sm ${borderClass}">
        <div class="flex justify-between p-2">
          <img class="w-6 h-6" src="${statusImg}" alt="">
          <button class="${priorityColor} px-4 py-2 rounded-full">${issue.priority}</button>
        </div>

        <div class="card-body">
          <h2 class="card-title">${issue.title}</h2>
          <p>${issue.description}</p>
          <div class="card-actions flex gap-2 mt-2">${labelsHTML}</div>
        </div>

        <hr class="border-gray-300">

        <div class="flex justify-between flex-col p-4 text-sm">
          <p>#${issue.author}</p>
          <p>${createdDate}</p>
        </div>
      </div>
    `;
  });
}