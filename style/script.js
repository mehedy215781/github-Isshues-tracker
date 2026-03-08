
const allIssue = document.getElementById('all-Issue');

// Count display
const countDisplay = document.getElementById('issue-count');

// Buttons
const buttons = document.querySelectorAll(".buttons .btn");

// Store all issues
let allIssuesData = [];

// manage spiner//
const manageSpinner =(status) =>{
  if(status === true){
    document.getElementById('spinner').classList.remove("hidden");
    document.getElementById('all-Issue').classList.add("hidden");
  }else{
     document.getElementById('all-Issue').classList.remove("hidden");
    document.getElementById('spinner').classList.add("hidden");
  }
};


// Fetch issues
manageSpinner(true);
fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
  .then(res => res.json())
  .then(data => {
    allIssuesData = data.data;
    displayIssue(allIssuesData); 
    countDisplay.innerText = `${allIssuesData.length} Issues`;
    manageSpinner(false);
  });

// Default All button blue
const allBtn = document.getElementById("all-btn");
allBtn.classList.add("bg-[#4A00FF]", "text-white");
allBtn.classList.remove("bg-white", "text-black");

// Button click (for loop version)
for(let i = 0; i < buttons.length; i++){
  buttons[i].addEventListener("click", function(){

    // Spinner show
    manageSpinner(true);

    // Reset buttons
    for(let j = 0; j < buttons.length; j++){
      buttons[j].classList.remove("bg-[#4A00FF]", "text-white");
      buttons[j].classList.add("bg-white", "text-black");
    }

    // Clicked button active
    this.classList.add("bg-[#4A00FF]", "text-white");
    this.classList.remove("bg-white", "text-black");

    // Filter issues
    let filteredIssues;
    if(this.id === "all-btn"){
      filteredIssues = allIssuesData;
    } else if(this.id === "open-btn"){
      filteredIssues = allIssuesData.filter(issue => issue.status === "open");
    } else if(this.id === "closed-btn"){
      filteredIssues = allIssuesData.filter(issue => issue.status === "closed");
    };
    // 
    setTimeout(() => {
      displayIssue(filteredIssues);
      countDisplay.innerText = `${filteredIssues.length} Issues`;
      // Spinner hide
      manageSpinner(false);
    }, 100);  
  });
}

function closeModal() {
  document.getElementById('myModal').classList.add('hidden');
}

function displayIssue(issues) {
    allIssue.innerHTML = "";

    issues.forEach(issue => {
        const isOpen = issue.status === "open";
        const borderClass = isOpen ? "border-t-4 border-[#00A96E]" : "border-t-4 border-[#A855F7]";
        const statusImg = isOpen ? "./assets/Open-Status.png" : "./assets/closed.png";
        
        const priorityClasses = {
            high: "bg-red-100 text-red-600 border border-red-200",
            medium: "bg-yellow-100 text-yellow-600 border border-yellow-200",
            low: "bg-gray-100 text-gray-600 border border-gray-200"
        };
        const priorityColor = priorityClasses[issue.priority?.toLowerCase()] || "bg-gray-100";

        let labelsHTML = (issue.labels || []).map(label => {
            const labelLower = label.toLowerCase();
            let color = "bg-gray-100 text-gray-600";
            if (labelLower === "bug") color = "bg-red-200 text-red-500 border border-red-200";
            if (labelLower === "help wanted") color = "bg-orange-200 text-orange-500 border border-orange-200";
            if (labelLower === "enhancement") color = "bg-green-200 text-green-600 border border-green-200";
            if (labelLower === "good first issue") color = "bg-blue-200 text-blue-600 border border-blue-200";
            if (labelLower === "documentation") color = "bg-fuchsia-200 text-fuchsia-600 border border-fuchsia-200";

            return `<span class="px-2 py-2 rounded text-[10px] font-bold uppercase ${color}">${label}</span>`;
        }).join(""); 

        const createdDate = issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : "N/A";

      // --- card element creating 
const card = document.createElement("div");
card.className = `card bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden cursor-pointer ${borderClass} transform hover:-translate-y-2`;

card.innerHTML = `
    <div class="p-6 md:p-8"> <div class="flex justify-between items-start mb-6">
            <img class="w-8 h-8" src="${statusImg}" alt="status"> <span class="px-4 py-1.5 rounded-full text-sm font-bold uppercase ${priorityColor}">
                ${issue.priority}
            </span>
        </div>
        
        <div class="mb-8">
            <h2 class="text-2xl font-extrabold text-slate-800 mb-3 leading-tight">${issue.title}</h2>
            <p class="text-base text-slate-600 leading-relaxed line-clamp-3">${issue.description}</p>
            <div class="flex flex-wrap gap-3 mt-5">${labelsHTML}</div>
        </div>

        <hr class="border-slate-100 my-5">

        <div class="flex justify-between items-center text-sm">
            <span class="font-bold text-slate-700 text-lg">#${issue.author || 'Unknown'}</span>
            <span class="text-slate-400 font-medium">${createdDate}</span>
        </div>
     </div>
   `;

        card.addEventListener("click", () => {
            if (typeof manageSpinner === "function") manageSpinner(true);

            fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${issue.id}`)
                .then(res => res.json())
                .then(result => {
                    const data = result.data; 
              
                    document.getElementById("modal-title").innerText = data.title || "No Title";
                    document.getElementById("modal-description").innerText = data.description || "No Description";
                    document.getElementById("modal-author").innerText = data.author || "Unknown";
                    document.getElementById("modal-assignee").innerText = data.author || "Unassigned";

                    const statusBadge = document.getElementById("modal-status-badge");
                    statusBadge.innerText = data.status || "Opened";
                    statusBadge.className = data.status === "open" 
                        ? "bg-emerald-500 px-3 py-1 rounded-full font-medium text-white" 
                        : "bg-purple-500 px-3 py-1 rounded-full font-medium text-white";

                    const priorityEl = document.getElementById("modal-priority");
                    priorityEl.innerText = data.priority || "Low";
                    const p = data.priority?.toLowerCase();
                    priorityEl.className = p === 'high' ? "bg-red-500 text-white px-4 py-1.5 rounded-lg font-bold text-sm uppercase" 
                  : p === 'medium' ? "bg-yellow-500 text-white px-4 py-1.5 rounded-lg font-bold text-sm uppercase"
                : "bg-gray-500 text-white px-4 py-1.5 rounded-lg font-bold text-sm uppercase";

                    // --- modal level update dynamically///
                    const labelContainer = document.getElementById("modal-labels-container");
                    labelContainer.innerHTML = ""; 
                    if (data.labels) {
                        data.labels.forEach(label => {
                            const labelLower = label.toLowerCase();
                            let labelColor = "bg-blue-50 text-blue-500 border-blue-200"; 
                            
                            if (labelLower === "bug") labelColor = "bg-red-50 text-red-500 border-red-200";
                            else if (labelLower === "help wanted") labelColor = "bg-orange-50 text-orange-500 border-orange-200";
                            else if (labelLower === "enhancement") labelColor = "bg-green-50 text-green-600 border-green-200";

                            const labelSpan = document.createElement("span");
                            labelSpan.className = `border px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${labelColor}`;
                            labelSpan.innerText = label;
                            labelContainer.appendChild(labelSpan);
                        });
                    }

                    if (typeof manageSpinner === "function") manageSpinner(false);
                    const modal = document.getElementById("myModal");
                    modal.classList.remove("hidden");
                    modal.classList.add("flex");
                })
                .catch(err => {
                    console.error(err);
                    if (typeof manageSpinner === "function") manageSpinner(false);
                });
        });

        allIssue.appendChild(card);
    });
}
// search///

const searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', (e) => {
    const searchText = e.target.value;

    // ১. যদি সার্চ বক্স খালি থাকে, তবে আগের সব ডাটা (allIssuesData) দেখিয়ে ফাংশন বন্ধ করে দাও
    if (!searchText) {
        displayIssue(allIssuesData);
        countDisplay.innerText = `${allIssuesData.length} Issues`;
        return;
    }

    // ২. সার্চ শুরু হলে স্পিনার দেখাও
    manageSpinner(true);

    // ৩. আপনার দেওয়া API লিঙ্ক দিয়ে ডাটা ফেচ করা
    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`)
        .then(res => res.json())
        .then(result => {
            const searchData = result.data || [];
            
            // কার্ডগুলো আপডেট করা
            displayIssue(searchData);
            
            // কতগুলো ডাটা পাওয়া গেল তা আপডেট করা
            countDisplay.innerText = `${searchData.length} Issues Found`;
            
            // কাজ শেষ, স্পিনার লুকাও
            manageSpinner(false);
        })
        .catch(err => {
            console.error("Search Error:", err);
            manageSpinner(false);
        });
});