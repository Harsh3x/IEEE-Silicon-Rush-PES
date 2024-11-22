const cameraInput = document.getElementById("cameraInput");
const imgIcon = document.getElementById("imgicon");
const capturedImage = document.getElementById("capturedImage");
const nutritionDetails = document.getElementById("nutritionDetails");
const doneButton = document.getElementById("doneButton");
const foodContainer=document.getElementById("foodval");
const p1=document.getElementById("protein1");
const cal1=document.getElementById("calorie1");
const f1=document.getElementById("fat1");
const c1=document.getElementById("carb1");
const cameraContainer=document.getElementById("c11");
let result;
let detail;
window.onload=()=>{
    console.log("onload kaam kia")
    foodContainer.style.display='none';
}
imgIcon.addEventListener("click", () => {
  cameraInput.click(); // Open camera or file input
});

async function apihandling(file) {
  const url = "https://web-production-a3f9.up.railway.app/predict";
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(url, { method: "POST", body: formData });
    if (!response.ok) throw new Error(`Prediction API error: ${response.status}`);
    result = await response.json();

    const foodResponse = await fetch(
      `http://172.17.13.208:3001/foodinfo/blaziken/${result.prediction}`
    );
    if (!foodResponse.ok)
      throw new Error(`Food Info API error: ${foodResponse.status}`);
    detail = await foodResponse.json();
    if(detail.category!=='none'){
        localStorage.setItem("details",JSON.stringify(detail));
    }
    console.log("details: ",detail);
  } catch (error) {
    console.error("Error during API calls:", error);
    detail = null;
  }
}

cameraInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (file) {
    await apihandling(file);

    if (!detail) {
      alert("Failed to fetch nutritional values. Please try again.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      // Update captured image on the main image
    //   capturedImage.src = e.target.result;
    //   capturedImage.style.display = "block";
        localStorage.setItem("imgurl",e.target.result);
        cameraContainer.style.display = "none";
        foodContainer.style.display="block";
        document.getElementById('displayImg').src=e.target.result;

      // Show nutritional details
    //   nutritionDetails.style.display = "block";
      document.getElementById("foodname1").innerText=detail.category;
      // Update nutritional values
      if(detail.category!=='none'){
        document.getElementById("protein1").innerText = `${detail.protein * 0.5}g`;
        document.getElementById("carb1").innerText = `${detail.carbohydrates * 0.5}g`;
        document.getElementById("fat1").innerText = `${detail.fats * 0.5}g`;
        document.getElementById("calorie1").innerText = `${detail.calories * 0.5} kcal`;
      }
    };
    // const res=await detail.text();
    // localStorage.setItem("details",res);
    reader.readAsDataURL(file);
  }
});

doneButton.addEventListener("click", () => {
//   capturedImage.style.display = "none"; // Hide captured image
  foodContainer.style.display = "none"; // Hide nutritional details
  cameraContainer.style.display = "block"; // Show camera icon
});
