#!/bin/bash

# Release branch
master="master"
origin="git@github.com:chenshengshui/tsquery.git"

git fetch $origin
echo "Current fetch all Tags"

git pull $origin $master
echo "Current pull origin $master."

# Auto generate version number and tag
npm version patch
conventional-changelog -p eslint -i CHANGELOG.md -s -r 0

git add CHANGELOG.md
git commit -m "docs: update changelog"

git push --follow-tags origin $master

echo "Git push origin $master"
echo "Release finished."