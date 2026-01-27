#!/bin/sh

# Runtime environment variable injection for Next.js
# This script replaces the build-time API URL with the runtime one

echo "🔧 Injecting runtime environment variables..."

# Find and replace the API URL in all JS files
if [ -n "$NEXT_PUBLIC_API_URL" ]; then
  echo "   Setting NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL"

  # Replace Railway URL in all JS files
  echo "   Replacing Railway URL..."
  find /app/.next -type f -name "*.js" -exec sed -i "s|https://agentapi-production-b5bb.up.railway.app|$NEXT_PUBLIC_API_URL|g" {} \;
  find /app -maxdepth 1 -type f -name "*.js" -exec sed -i "s|https://agentapi-production-b5bb.up.railway.app|$NEXT_PUBLIC_API_URL|g" {} \;

  # Replace localhost fallback URL in all JS files
  echo "   Replacing localhost fallback URL..."
  find /app/.next -type f -name "*.js" -exec sed -i "s|http://localhost:8000|$NEXT_PUBLIC_API_URL|g" {} \;
  find /app -maxdepth 1 -type f -name "*.js" -exec sed -i "s|http://localhost:8000|$NEXT_PUBLIC_API_URL|g" {} \;

  echo "✅ Runtime config updated: NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL"
else
  echo "⚠️  NEXT_PUBLIC_API_URL not set, using build-time value"
fi

# Start the Next.js server
exec node server.js

