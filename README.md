<!-- PROJECT LOGO -->
<br>
<div align="center">
  <a href="#">
    <img src="src/Utilities/Logo.png" alt="GateKeeper Logo" width="175" height="80">
  </a>

  <h3 align="center">Gatekeeper</h3>

  <p align="center">
   A one of kind attendance management system
    <br />
    <a href="https://justadudewhohacks.github.io/face-api.js/docs/index.html"><strong>Tensorflow Face-API ></strong></a>
    <br />
    <br />
    <a target="_blank" href="https://gatekeeper-2a20c.web.app/">View Deployment</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project
      </a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#demo">Demo</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#planned-features-for-the-project">Planned Features</a></li>
      </ul>
    </li>
    <li>
       <a href="#server-routes">Server routes</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
    </li>
  </ol>
</details>

<br/>

<!-- ABOUT THE PROJECT -->

## About The Project

GateKeeper is one of a kind real time attendece management system built using face-api on top of tenserflow and has a decentralised payment system built using Hedera Hashgraph
<br/><br/>

### Built With

- **[Tensorflow](https://justadudewhohacks.github.io/face-api.js/docs/index.html)** for face-API
- **[ReactJS](https://reactjs.org/docs/getting-started.html)** for front-end
- **[NodeJS]([https://reactjs.org/docs/getting-started.html](https://nodejs.org/docs/latest-v20.x/api/))** for server
- **[Hedera Hashgraph-SDK](https://docs.hedera.com/guides/)** for creating decentralised accounts and payment system
- **[Express](https://expressjs.com/)** middleware on the backend to handle api routes and requests
- **[Firebase](https://firebase.google.com/)** database and also used for authentication
- **[Heroku](https://www.heroku.com/)** used for deploying and hosting the project
- **[Github](https://github.com/)** for CI/CD and git
- **[Firebase](https://firebase.google.com/)** for hosting frontend
  <br/>

### Demo

https://github.com/saswatsam786/gateKeeper/assets/77463804/cb95f924-91b6-49d5-9a45-27452679c1da
<br/>

### Features

1. **Recording attendance** - Uses Tensorflow's advanced real-time face recognition algorithm to verify registered users only and track attendance.

2. **Statistics** - Complex real-time data visualization made easy using chart.js

3. **Rewards** - Collect crypto-credits(in hbars) for successfully maintaining streak of attendance at 28th of every month.

4. **Uploading Photo** - Users are required to register their photo into the database in order for the application to work.

5. **Built on the Hedera network** - An attendance management system built on the decentralized Hedera network using the Hashgraph SDK with decentralized payment system to transfer crypto hbars with other users.

6. **Check balance** - Settings page has been made for the user, where one can see his Hedera account id, account balance, account creation date, and transaction history.

<br/>

### Planned features for the project

- A built-in store to spend your earned credits on college merch
- Upload and check the status of the leave application in the student portal.
- Verification system for leave application on the college portal

<p align="right">(<a href="#">Back to top</a>)</p>

<!-- ## Currently working on

1. xyz
2. abc -->

## Server Routes

| Type | Route          | Description                                                                                                                    |
| :--: | -------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| GET  | /createAccount | Creates an account for the user on the Hedera Network with a unique account ID                                                 |
| POST | /balance       | Checks the balance of the user                                                                                                 |
| POST | /transferMoney | Used for making a transaction between users                                                                                    |
| POST | /deleteAccount | Called when the user deletes his/her account essentially deleting their account from the Hedera network and Firestore database |

<p align="right">(<a href="#">Back to top</a>)</p>

## Getting started

```bash
git clone https://github.com/saswatsam786/gateKeeper.git
git checkout dev-branch
```

Create a .env file in the root directory:

```
REACT_APP_FIREBASE_API_KEY=<your_api_key>
REACT_APP_FIREBASE_AUTH_DOMAIN=<your_project_id>.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=<your_project_id>
REACT_APP_FIREBASE_STORAGE_BUCKET=<your_project_id>.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<your_project_messaging_id>
REACT_APP_FIREBASE_APP_ID=<your_project_app_id>
REACT_APP_ACCOUNT_ID=<your_hedera_testnet_id_same_as_server>
REACT_APP_PRIVATE_KEY=<your_private_key_same_as_server>
REACT_APP_FACT_KEY=<You_can_get_from_ https://api-ninjas.com/api/facts>
```

Now create a .env file in the server directory:

```bash
MY_ACCOUNT_ID=<your_hedera_testnet_id>
MY_PRIVATE_KEY=<your_private_key>
MY_PUBLIC_KEY=<your_public_key>

# (for new user, they can register themselves at link given below and get the above credentials)
https://portal.hedera.com/login
```

Run the command in the **root directory and the server directory to install all the dependencies**:

```
npm install
npm start
```

To run the server on the local machine:

```bash
cd server
npm i
npm start
```

```if error then just refresh the page```
```Attendance is recorded between 11:00 AM and 11:00 PM```
<a align="center" target="_blank" href="https://docs.google.com/presentation/d/1NMp7bxfiAiH_TOWzKF-rweuZy2ipltidb2X6IYFifuc/edit?usp=sharing">View Slides for more details</a>


<p align="right">(<a href="#">Back to top</a>)</p>
