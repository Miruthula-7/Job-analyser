const jobDatabase = {
  "Web Developer": ["html", "css", "javascript", "react", "frontend"],
  "Backend Developer": ["node", "express", "mongodb", "api", "backend"],
  "Data Scientist": ["python", "machine learning", "data", "pandas", "numpy"],
  "DevOps Engineer": ["docker", "kubernetes", "aws", "jenkins", "ci/cd"]
};

async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(" ");
    text += " " + pageText;
  }
  return text.toLowerCase();
}

async function analyzeResume() {
  const fileInput = document.getElementById("resumeFile");
  const file = fileInput.files[0];

  if (!file || file.type !== "application/pdf") {
    alert("Please upload a valid PDF resume.");
    return;
  }

  const resumeText = await extractTextFromPDF(file);
  const eligibleJobs = [];

  for (let job in jobDatabase) {
    const keywords = jobDatabase[job];
    const found = keywords.some(keyword => resumeText.includes(keyword));
    if (found) {
      eligibleJobs.push(job);
    }
  }

  document.getElementById("result").innerText = eligibleJobs.length
    ? `Eligible Jobs:\n${eligibleJobs.join(", ")}`
    : "No matching jobs found.";
}