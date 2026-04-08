# Complete PM2 Setup Guide for NestJS Projects

## 📌 Important Notes Before You Start

⚠️ **CRITICAL WARNINGS:**
- ALWAYS run `npm run build` before starting or restarting your app
- NestJS runs from `dist/main.js`, NOT from TypeScript files (`src/main.ts` or `app.module.ts`)
- PM2 on Windows shows 0b memory usage - this is a display bug, ignore it
- Never use `dropSchema: true` in production with TypeORM

---

## 1. Install PM2 Globally

```bash
npm install pm2@latest -g

# 2. Build Your NestJS Project
npm run build

# 3. Generate PM2 Ecosystem File
pm2 ecosystem

# 4. Configure the Ecosystem File
# 5. Start Your App with PM2
pm2 start ecosystem.config.js

Verify it's working:
# Check status
pm2 status

# View logs
pm2 logs nestjs-app

# Test the API
start http://localhost:3000

# 6. Management Commands
pm2 restart all          # Restart all applications
pm2 reload all           # Zero-downtime reload (cluster mode only)
pm2 stop all             # Stop all applications
pm2 delete all           # Delete all applications from PM2

# Specific app commands
pm2 restart nestjs-app   # Restart specific app
pm2 stop nestjs-app      # Stop specific app
pm2 delete nestjs-app    # Delete specific app

# 7. Monitoring & Logs
# View status
pm2 status
pm2 show nestjs-app      # Detailed info about specific app

# View logs
pm2 logs nestjs-app                    # Live logs
pm2 logs nestjs-app --lines 50         # Last 50 lines
pm2 flush nestjs-app                   # Clear log files

# Real-time monitoring
pm2 monit                              # CPU/Memory dashboard

# 8. After Code Changes (Daily Workflow)
# Step 1: Build the project
npm run build

# Step 2: Restart with PM2
pm2 restart nestjs-app

# OR in one command:
npm run build && pm2 restart nestjs-app

9. Save Configuration for Auto-Start
For Linux/macOS:
# Save current process list
pm2 save

# Generate startup script (run once)
pm2 startup

For Windows:
# Install Windows startup module
npm install -g pm2-windows-startup
pm2-startup install

# 10. Complete Cleanup
pm2 stop all             # Stop all apps
pm2 delete all           # Delete all apps
pm2 kill                 # Kill PM2 daemon completely

