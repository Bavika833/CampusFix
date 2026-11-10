# CampusFix

A lightweight campus maintenance complaint portal. The static app lets students submit an issue with a category, location, description, and optional photo, then see its status on the overview page.

## Run locally

Open `index.html` in a browser, or serve this folder with any static web server. No build step or package installation is needed.

## Deploy

Deploy this folder as a static site with GitHub Pages, Netlify, Vercel, or any static hosting provider. Set the publish/root directory to the project folder; there is no build command.

## Demo behavior and production notes

Reports are saved in the current browser's `localStorage`, so this is suitable for a classroom demo and static hosting. Data is not shared across users or devices. For a live campus rollout, connect the form and admin workflow to a backend with authentication, shared storage, and protected photo uploads. The emergency contact and campus details are sample content and should be changed for your campus.
