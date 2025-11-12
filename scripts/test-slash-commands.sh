#!/bin/bash

# Quick Test Script for Slash Commands
# Run this to verify slash commands integration

echo "🧪 Testing TipTap Slash Commands Integration"
echo "============================================"
echo ""

# Check if required files exist
echo "📁 Checking files..."

files=(
  "components/tiptap-editor.tsx"
  "components/slash-commands.tsx"
  "components/slash-commands-extension.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file - MISSING!"
  fi
done

echo ""
echo "📦 Checking dependencies..."

# Check if dependencies are installed
if grep -q "tippy.js" package.json; then
  echo "✅ tippy.js installed"
else
  echo "❌ tippy.js missing"
fi

if grep -q "@tiptap/suggestion" package.json; then
  echo "✅ @tiptap/suggestion installed"
else
  echo "❌ @tiptap/suggestion missing"
fi

echo ""
echo "🔍 Checking integration..."

# Check if SlashCommandsExtension is imported
if grep -q "SlashCommandsExtension" components/tiptap-editor.tsx; then
  echo "✅ SlashCommandsExtension imported"
else
  echo "❌ SlashCommandsExtension not imported"
fi

# Check if slash commands are configured
if grep -q "slashCommands" components/tiptap-editor.tsx; then
  echo "✅ Slash commands configured"
else
  echo "❌ Slash commands not configured"
fi

echo ""
echo "📊 Commands count:"
commands_count=$(grep -c "title:" components/slash-commands.tsx)
echo "   Found $commands_count commands"

echo ""
echo "✨ Manual Test Steps:"
echo "1. Start dev server: bun dev"
echo "2. Go to: http://localhost:3000/admin/content/new"
echo "3. Click in the content editor"
echo "4. Type: /"
echo "5. Verify slash menu appears with commands"
echo "6. Type: /h"
echo "7. Verify only Heading commands show"
echo "8. Use Arrow keys to navigate"
echo "9. Press Enter to select"
echo "10. Verify command executes correctly"
echo ""
echo "🎯 Expected Results:"
echo "   - Menu appears instantly on /"
echo "   - 12 commands visible"
echo "   - Filter works on typing"
echo "   - Keyboard navigation works"
echo "   - Commands execute properly"
echo ""
echo "============================================"
echo "✅ Integration check complete!"
