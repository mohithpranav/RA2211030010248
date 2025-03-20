import fetch from "node-fetch";

const url = "http://20.244.56.144/test/register";
const payload = {
  companyName: "Afford Medicals",
  ownerName: "Vakati Mohith Pranav Reddy",
  rollNo: "RA2211030010248",
  ownerEmail: "mv9575@srmist.edu.in",
  accessCode: "SUfGJv",
};

const headers = {
  "Content-Type": "application/json",
};

async function register() {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Registration Successful!", data);
    } else {
      console.error("Registration Failed!", data);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

register();
