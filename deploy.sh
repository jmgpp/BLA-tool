#!/bin/bash

# Build the project
npm run build

# Navigate to the build output directory
cd dist

# Create a .nojekyll file to bypass Jekyll processing
touch .nojekyll

# Initialize a new Git repository
git init
git checkout -b main

# Add all files to the repository
git add .

# Commit the changes
git commit -m "Deploy to GitHub Pages"

# Add the remote repository
git remote add origin https://github.com/jmgpp/BLA-tool.git

# Force push to the gh-pages branch
git push -f origin main:gh-pages

# Return to the project root directory
cd ..

echo "Deployment complete!" 