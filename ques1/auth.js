import fetch from "node-fetch";

const url = "http://20.244.56.144/test/auth";

const payload = {
  companyName: "Afford Medicals",
  clientID: "c94c6045-600c-4f68-9d65-c7ffcc2e94f7",
  clientSecret: "uqFjBJwlbrHuGLbo",
  ownerName: "Vakati Mohith Pranav Reddy",
  ownerEmail: "mv9575@srmist.edu.in",
  rollNo: "RA2211030010248",
};

const headers = {
  "Content-Type": "application/json",
};

async function getAuthToken() {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Authorization Token Received!", data);
    } else {
      console.error("Failed to Get Token!", data);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

getAuthToken();
