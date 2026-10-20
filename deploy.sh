#!/bin/sh
# Runs on the FreeBSD server from the CI deploy job: sh /root/contacts-manager/deploy.sh
# The body is wrapped in braces so sh reads the whole script before "git pull" can rewrite this file.
{
  set -eu
  cd "$(dirname "$0")"

  git pull --ff-only
  bun install --frozen-lockfile
  bun run --filter frontend build

  # Services are (re)installed on every deploy, so changes to the rc.d scripts are picked up too.
  install -m 755 rc.d/backend rc.d/sender /usr/local/etc/rc.d/
  sysrc backend_enable=YES sender_enable=YES

  service backend restart
  service sender restart

  exit
}
