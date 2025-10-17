# Project2: Recipe Finder

## Project Objective
Recipe Finder is a full-stack web application that allows users to browse a collection of external recipes ([Kaggle Food.com Recipes and Interactions](https://www.kaggle.com/datasets/shuyangli94/food-com-recipes-and-user-interactions/data)), create their own custom recipes, and save favorites. The application provides an intuitive interface for recipe management with features including browsing, adding custom recipes, editing and deleting personal recipes, and maintaining a favorites collection. 

## Screenshot
<img width="1463" height="808" alt="A thumbnail of Ran Fukazawa personal homepage" src="https://ranfukazawa.github.io/project1-personal_homepage/image/thumbnail_personalHomepage.png" />


## Tech Requirements
### Frontend
- HTML5
- CSS3
- JavaScript (ES6)
- Bootstrap 5.3
- Bootstrap Icons

### Backend
- Node.js (v22.x)
- Express.js (v4.18.2)
- MongoDB Driver (v6.3.0)

### Database
- MongoDB Atlas (cloud database)

### Deployment
- Vercel (serverless platform)

## How to Install/Use Locally
### Prerequisites
- Node.js (v18.x or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Installation Steps
1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/RanFukazawa/Project2-Recipe-Finder
   cd Project2-Recipe-Finder

2. Install dependencies
   ```bash
   npm install

3. Set up environment variables: Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/recipeFinder
   # Or use MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/recipeFinder
   PORT=3000
   NODE_ENV=production

4. Import data:
   ```bash
   mongoimport --db recipeFinder --collection external_recipes --file recipes.json --jsonArray

5. Start the development server:
    ```bash
    npm start

6. Open your browser
    ```bash
    http://localhost:3000

## How to Deploy to Vercel

### Prerequisites
- Vercel account (free tier works)
- MongoDB Atlas account (free tier works)

### Deployment Steps
1. Set up MongoDB Atlas:
    - Create a free cluster at MongoDB Atlas
    - Create a database user
    - Whitelist all IPs (0.0.0.0/0) under Network Access
- Get your connection string

2. Install Vercel CLI (optional):
    ```bash
    npm install -g vercel

3. Deploy via Vercel CLI:
    ```bash
    vercel login
    vercel
Or **Deploy via Vercel Dashboard:**
- Go to vercel.com
- Click "Add New Project"
- Import the cloned GitHub repository
- Configure project settings (default settings work)

4. Add environment variables in Vercel:
- Go to Project Settings -> Environment Variables
- Add:
    - Key: MONGODB_URI
    - Value: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/recipeFinder?retryWrites=true&w=majority
- Select: All Environments (Production, Preview, Development)
- Click Save

5. Deploy to production:
    ```bash
    vercel --prod

6. Access your live app:
    ```bash
    https://your-project-name.vercel.app

## Author
Ran Fukazawa

[Visit Recipe Finder Web App](https://project2-recipe-finder.vercel.app/index.html)

## Reference
This project was created as part of [CS5610 Project 2](https://northeastern.instructure.com/courses/225993/assignments/2901101) coursework.

## Video Demonstration
[Link to video](https://youtu.be/UBK8wDO2AjA)

## Generative AI Usage
This project used **Claude.ai Sonnet4.5** (by Anthropic) for assistance in the following areas:  

1. **Deploying to Vercel**  
   - **Prompt:**  
     *"I am deploying my Node.js Express app to Vercel but getting 500 errors. Help me configure vercel.json and fix the deployment"*  
   - **Outcome:** Successfully configured Vercel severless functions, resolved ES module issues, and set up proper routing between API endpoints and static files.  

2. **Frontend-Backend Integration**  
   - **Prompt:**  
     *"How do I structure my frontend JavaScript to work with both local development and Vercel deployment?"*  
   - **Outcome:** Implemented modular JavaScript with proper API endpoint configuration, modal form loaders, and event handling for dynamic content.  

3. **Polishing Documentation**  
   - **Prompt:**  
     *"Help me draft clear, professional documents for my RECIPE FINDER Design Document and README."*  
   - **Outcome:** Created comprehensive README with installation instructions, deployment guide, and troubleshooting section.  
