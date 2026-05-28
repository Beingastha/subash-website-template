#!/usr/bin/env bash

# ==============================================================================
# "GOVT. HSS EXCELLENCE" - DEPLOYMENT SCRIPT
# ==============================================================================
# This script syncs static site files to the Nginx web root on the remote server
# while maintaining correct group permissions (www-data) for the CMS admin panel.
# ==============================================================================

set -e

# ===== Configuration =====
REMOTE_USER="azureuser"
REMOTE_HOST="20.235.240.199"
REMOTE_DIR="/var/www/html/subhash.ariham.com"
SSH_TARGET="${REMOTE_USER}@${REMOTE_HOST}"

# Color definitions
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'
BOLD='\033[1m'

log()     { echo -e "${BLUE}${BOLD}[DEPLOY]${NC} $1"; }
success() { echo -e "${GREEN}${BOLD}[  OK  ]${NC} $1"; }
warn()    { echo -e "${YELLOW}${BOLD}[ WARN ]${NC} $1"; }
error()   { echo -e "${RED}${BOLD}[ERROR ]${NC} $1"; }

# 1. Verify SSH connectivity
log "Testing SSH connection to ${SSH_TARGET}..."
if ! ssh -o ConnectTimeout=10 -o BatchMode=yes "${SSH_TARGET}" "echo connected" 2>/dev/null; then
  error "Cannot connect to ${SSH_TARGET}. Check your SSH key and network configuration."
  exit 1
fi
success "SSH connection verified"

# 2. Sync project code via rsync
# We use --no-p and --no-g combined with --chmod to ensure:
# - All files have 664 (rw-rw-r--) so both azureuser and www-data can write to them
# - All directories have 775 (rwxrwxr-x) so they are writable and traversable
log "Syncing files to server at ${REMOTE_DIR}..."
rsync -avz --delete \
  --no-p --no-g \
  --chmod=Du=rwx,Dg=rwx,Do=rx,Fu=rw,Fg=rw,Fo=r \
  --exclude '.git/' \
  --exclude '.gitignore' \
  --exclude '.DS_Store' \
  --exclude 'CNAME' \
  --exclude 'deploy.sh' \
  ./ "${SSH_TARGET}:${REMOTE_DIR}/"
success "Files synchronized successfully"

# 3. Fix remote ownership and setgid on the server
# The setgid bit (chmod g+s) ensures any new files/images uploaded by the PHP admin
# automatically inherit the 'www-data' group.
log "Ensuring remote ownership and setgid permissions are correct..."
ssh -t "${SSH_TARGET}" "sudo chown -R azureuser:www-data ${REMOTE_DIR} && sudo find ${REMOTE_DIR} -type d -exec chmod 2775 {} +"
success "Remote permissions and ownership secured"

echo ""
echo -e "=============================================="
success "DEPLOYMENT COMPLETED SUCCESSFULLY"
echo -e "=============================================="
echo -e "  URL:  ${BOLD}https://subhash.ariham.com${NC}"
echo -e "=============================================="
