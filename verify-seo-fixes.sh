#!/bin/bash

# SEO Fix Verification Script
# Run this after deploying to production

echo "🔍 SEO Fix Verification"
echo "======================="
echo ""

# Check if robots.txt is accessible
echo "1. Checking robots.txt..."
curl -s https://www.sketchshaper.com/robots.txt | head -20
echo ""

# Check if RSC URLs return noindex header
echo "2. Testing RSC URL headers..."
curl -I "https://www.sketchshaper.com/?_rsc=test123" 2>&1 | grep -i "x-robots-tag"
echo ""

# Check redirects
echo "3. Testing URL redirects..."
curl -I "https://www.sketchshaper.com/sketchup-3d-models-3" 2>&1 | grep -i "location"
echo ""

echo "4. Testing api.php redirect..."
curl -I "https://www.sketchshaper.com/api.php" 2>&1 | grep -i "location"
echo ""

echo "✅ Verification complete!"
echo ""
echo "Next steps:"
echo "- Submit sitemap to Google Search Console"
echo "- Request removal of bad URLs"
echo "- Monitor for 2-4 weeks"
