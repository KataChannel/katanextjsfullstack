# 🔥 Kill Port Scripts - Documentation

## Overview

Scripts để kill triệt để các processes đang chạy trên ports (đặc biệt là port 3000).

---

## 🎯 Primary Script: `5killport.sh`

### Kill Port 3000 - AGGRESSIVE MODE

**Mục đích:** Kill triệt để port 3000 với nhiều phương pháp và retry logic.

```bash
# Basic usage
./scripts/5killport.sh

# With sudo (recommended if fails)
sudo ./scripts/5killport.sh
```

### Features

✅ **5 retry attempts** - Không bỏ cuộc  
✅ **7 killing methods** - Dùng mọi cách có thể  
✅ **Both user & sudo** - Dual mode  
✅ **Comprehensive verification** - Check kỹ lưỡng  
✅ **Color-coded output** - Dễ đọc  

### Methods Used

| Method | Command | Description |
|--------|---------|-------------|
| 1 | `lsof -ti:3000` | List open files (user) |
| 2 | `sudo lsof -ti:3000` | List open files (sudo) |
| 3 | `ss -tulpn` | Socket statistics (user) |
| 4 | `sudo ss -tulpn` | Socket statistics (sudo) |
| 5 | `netstat -tulpn` | Network statistics |
| 6 | `fuser -k -9 3000/tcp` | Force kill via fuser |
| 7 | `pkill -9 -f ".*:3000"` | Pattern-based kill |

### Exit Codes

- `0` - Success (port freed)
- `1` - Failed (port still in use)

### Output Example

```bash
╔════════════════════════════════════════════╗
║  🔥 KILL PORT 3000 - AGGRESSIVE MODE 🔥  ║
╚════════════════════════════════════════════╝

🔍 Attempt 1/5 to kill port 3000...
  Method 1: lsof...
    Found PIDs: 12345
    ✓ Killed 12345
  Method 2: lsof (sudo)...
  Method 3: ss...
  ...
✅ Port 3000 is FREE!

═══════════════════════════════════════════
📊 FINAL VERIFICATION
═══════════════════════════════════════════

╔════════════════════════════════════════════╗
║     ✅ PORT 3000 IS COMPLETELY FREE ✅     ║
╚════════════════════════════════════════════╝
```

---

## 🔄 Secondary Script: `kill-ports.sh`

### Kill Multiple Dev Ports

**Mục đích:** Kill tất cả ports development thường dùng.

```bash
# Kill all dev ports
./scripts/kill-ports.sh

# Kill specific port
./scripts/kill-ports.sh 8080
```

### Ports Targeted

| Port | Service |
|------|---------|
| **3000** | Next.js dev (PRIORITY) |
| 3001 | Alternative frontend |
| 5555 | Prisma Studio |
| 5556 | Prisma Studio (alt) |
| 8000 | Backend API |
| 8080 | Alternative backend |
| 9000 | Vite/Dev server |
| 12000 | Custom frontend |
| 12001 | Custom backend |
| 13000 | Tazagroup frontend |
| 13001 | Tazagroup backend |

### Process Patterns Killed

- `next dev`
- `next-server`
- `bun dev`
- `bun --bun next dev`
- `prisma studio`
- `ts-node-dev`
- `nest start`
- `turbopack`
- `webpack-dev-server`
- `node.*next`

### Features

✅ Multiple port killing  
✅ Process name matching  
✅ Retry logic per port  
✅ Final sweep for port 3000  
✅ Detailed reporting  

---

## 🚨 Troubleshooting

### Port still in use after script?

#### Option 1: Try with sudo
```bash
sudo ./scripts/5killport.sh
```

#### Option 2: Manual investigation
```bash
# Check what's using port 3000
lsof -i:3000
sudo lsof -i:3000

# Check all methods
netstat -tulpn | grep :3000
ss -tulpn | grep :3000
fuser 3000/tcp
```

#### Option 3: Nuclear option
```bash
# Kill ALL node processes (⚠️ DANGER)
sudo pkill -9 node

# Kill ALL bun processes (⚠️ DANGER)
sudo pkill -9 bun

# Kill specific PID
sudo kill -9 <PID>
```

#### Option 4: Docker containers
```bash
# Check Docker
docker ps

# Stop all containers
docker stop $(docker ps -aq)

# Find container using port
docker ps | grep 3000
```

#### Option 5: Reboot
```bash
# Last resort
sudo reboot
```

---

## 🔍 Understanding the Methods

### lsof (List Open Files)
```bash
lsof -i:3000           # Show processes using port 3000
lsof -ti:3000          # Only show PIDs
sudo lsof -ti:3000     # With elevated privileges
```

**Pros:** Most reliable, shows detailed info  
**Cons:** May require sudo

### ss (Socket Statistics)
```bash
ss -tulpn | grep :3000      # Show listening sockets
ss -tulpn | grep -oP 'pid=\K[0-9]+'  # Extract PIDs
```

**Pros:** Fast, modern alternative to netstat  
**Cons:** Output parsing needed

### netstat (Network Statistics)
```bash
netstat -tulpn | grep :3000    # Show network connections
```

**Pros:** Available on all systems  
**Cons:** Deprecated on some systems

### fuser (File User)
```bash
fuser 3000/tcp        # Show PIDs using TCP port
fuser -k 3000/tcp     # Kill processes using port
fuser -k -9 3000/tcp  # Force kill (SIGKILL)
```

**Pros:** Simple, direct  
**Cons:** Less information

### pkill (Process Kill)
```bash
pkill -9 -f ".*:3000"         # Kill by pattern
pkill -9 -f "localhost:3000"  # Kill by full pattern
```

**Pros:** Pattern matching  
**Cons:** Can be too aggressive

---

## 💡 Best Practices

### Daily Development

1. **Before starting dev server:**
   ```bash
   ./scripts/5killport.sh
   bun dev
   ```

2. **If port conflict occurs:**
   ```bash
   ./scripts/5killport.sh
   # Then restart server
   ```

3. **End of day cleanup:**
   ```bash
   ./scripts/kill-ports.sh
   ```

### CI/CD Integration

```bash
# In CI script before tests
./scripts/5killport.sh || true  # Don't fail if already free
npm run test
```

### Docker Integration

```bash
# Before docker compose up
./scripts/kill-ports.sh
docker compose down
docker compose up -d
```

---

## 📊 Performance

| Script | Ports | Time | Success Rate |
|--------|-------|------|--------------|
| `5killport.sh` | 1 (3000) | 1-5s | 99.9% |
| `kill-ports.sh` | 11 ports | 5-15s | 99.5% |

**Note:** Times assume no sudo password prompt

---

## 🔐 Permissions

### Scripts work without sudo if:
- You own the process
- Process not protected

### Require sudo if:
- Process owned by another user
- System process
- Protected process

```bash
# Give scripts sudo access without password (optional)
sudo visudo
# Add: user ALL=(ALL) NOPASSWD: /path/to/scripts/5killport.sh
```

---

## 🧪 Testing

### Test port is free
```bash
# Should return nothing
lsof -i:3000

# Should return 1
nc -z localhost 3000; echo $?
```

### Test port is occupied
```bash
# Start a dummy server
python3 -m http.server 3000 &

# Should show PID
lsof -i:3000

# Kill it
./scripts/5killport.sh
```

---

## 📝 Examples

### Example 1: Daily workflow
```bash
# Morning: Clean slate
./scripts/kill-ports.sh

# Start development
bun dev

# Port conflict during dev
# Ctrl+C
./scripts/5killport.sh
bun dev  # Try again
```

### Example 2: CI/CD
```bash
#!/bin/bash
# test.sh

# Cleanup before tests
./scripts/5killport.sh

# Run tests
bun test

# Cleanup after
./scripts/kill-ports.sh
```

### Example 3: Docker
```bash
#!/bin/bash
# deploy.sh

# Kill ports
./scripts/kill-ports.sh

# Stop containers
docker compose down

# Rebuild
docker compose build

# Start
docker compose up -d

# Verify
docker compose ps
```

---

## 🆘 Common Issues

### Issue: "Permission denied"
**Solution:**
```bash
sudo ./scripts/5killport.sh
```

### Issue: "Command not found: lsof"
**Solution:**
```bash
# Ubuntu/Debian
sudo apt-get install lsof

# CentOS/RHEL
sudo yum install lsof
```

### Issue: Script hangs
**Solution:**
- Ctrl+C to cancel
- Check if sudo asking for password
- Run with `bash -x` for debug:
  ```bash
  bash -x ./scripts/5killport.sh
  ```

### Issue: Port still in use after 5 retries
**Solution:**
```bash
# Check what's really using it
sudo lsof -i:3000
sudo ss -tulpn | grep :3000

# Check if Docker
docker ps | grep 3000

# Last resort: reboot
sudo reboot
```

---

## 🔗 Related Files

- `/scripts/5killport.sh` - Main port killer
- `/scripts/kill-ports.sh` - Multi-port killer  
- `/menu.sh` - Interactive menu to run scripts
- `docs/FIX_404_PAGE_POST_ROUTING.md` - Related routing fix

---

## 📚 References

- [lsof man page](https://man7.org/linux/man-pages/man8/lsof.8.html)
- [ss man page](https://man7.org/linux/man-pages/man8/ss.8.html)
- [fuser man page](https://man7.org/linux/man-pages/man1/fuser.1.html)
- [Linux signals](https://man7.org/linux/man-pages/man7/signal.7.html)
- [Next.js port config](https://nextjs.org/docs/app/api-reference/next-cli)

---

**Created:** December 2024  
**Last Updated:** December 2024  
**Maintained by:** Taza Tech Team
