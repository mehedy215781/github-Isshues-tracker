 const allIssue = document.getElementById('all-Issue');

 const buttons = document.querySelectorAll(".buttons .btn");


let allIssuesData = [];
 
 fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
.then((res) => res.json())
.then((data) => displayIssue(data.data))


function displayIssue(issues){
 console.log(issues);

 issues.forEach(issue =>{

    const card = document.createElement("div");
    card.className = "grid sm:grid-cols-1 gap-3";

    // 
    
// button ///

const allBtn = document.getElementById("all-btn");
allBtn.classList.add("bg-[#4A00FF]", "text-white");
allBtn.classList.remove("bg-white", "text-black");

// button click//
for(let i = 0; i < buttons.length; i++){
  buttons[i].addEventListener("click", function(){

    // button resett//
    for(let j = 0; j < buttons.length; j++){
      buttons[j].classList.remove("bg-[#4A00FF]", "text-white");
      buttons[j].classList.add("bg-white", "text-black");
    }

    // clicled button active//
    this.classList.add("bg-[#4A00FF]", "text-white");
    this.classList.remove("bg-white", "text-black");
  

         
  });
}

    // * border top color change *//
     let borderClass;

if(issue.status === "open"){
  borderClass = "border-t-4 border-[#00A96E]";  
}else{
  borderClass = "border-t-4 border-[#A855F7]";   
}

    /* status image show */
    let statusImg;

    if(issue.status === "open"){
      statusImg = "./assets/Open-Status.png";
      
    }else{
      statusImg = "./assets/closed.png";
    }

    /* priority color change */
    let priorityColor;
    if(issue.priority === "high"){
      priorityColor = "bg-red-300";
    }else if(issue.priority === "medium"){
      priorityColor = "bg-yellow-300";
    }else{
      priorityColor = "bg-gray-300";
    }

    /* labels dynamic color change */
    let labelsHTML = "";

    if(issue.labels){
      issue.labels.forEach(label => {

        let labelColor;

        if(label === "bug"){
          labelColor = "bg-red-200 text-red-700";
        } 
        else if(label === "enhancement"){
          labelColor = "bg-green-200 text-green-700";
        } 
        else if(label === "help wanted"){
          labelColor = "bg-yellow-200 text-yellow-700";
        } 
        else if (label === "good first issue"){
          labelColor = "bg-blue-200";
        } else{
              labelColor = "bg-purple-200";
        }

        labelsHTML += `
          <div class="badge ${labelColor}">
            ${label}
          </div>
        `;
      });
    }

    /* date format */
    let createdDate = "";
    if(issue.createdAt){
      createdDate = new Date(issue.createdAt).toLocaleDateString();
    }

    card.innerHTML = `
     <div class="card bg-base-100 p-3 w-full shadow-sm ${borderClass}">

        <div class="flex justify-between p-2">
            <img class="w-6 h-6" src="${statusImg}" alt="">
            <button class="${priorityColor} px-4 py-2 rounded-full">
              ${issue.priority}
            </button>
        </div>

        <div class="card-body">
            <h2 class="card-title">
                ${issue.title}
            </h2>

            <p>
              ${issue.description}
            </p>

            <div class="card-actions gap-2">
              ${labelsHTML}
            </div>
        </div>

        <hr class="border-gray-300">

        <div class="flex justify-between flex-col p-4 text-sm">
            <p>#${issue.author}</p> 
            <p>${createdDate}</p>
        </div>

     </div>
    `;

    allIssue.appendChild(card);

 });

}












