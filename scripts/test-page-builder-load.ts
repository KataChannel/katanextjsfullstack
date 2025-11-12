/**
 * Test script: Simulate loading Page Builder data
 * Kiểm tra logic load có hoạt động đúng không
 */

// Simulate blocks data từ database
const testCases = [
  {
    name: 'Seed data (Array format)',
    blocks: {
      canvas: {
        zoom: 1,
        gridSize: 8,
        snapToGrid: true,
      },
      elements: [
        { id: 'hero-1', type: 'container', x: 0, y: 0, width: 1440, height: 600 },
        { id: 'text-1', type: 'text', content: 'Hello', x: 100, y: 100 },
      ],
    },
  },
  {
    name: 'New save (Object format)',
    blocks: {
      canvas: {
        zoom: 1,
        gridSize: 12,
        snapToGrid: true,
        elements: {
          'hero-1': { id: 'hero-1', type: 'container', x: 0, y: 0 },
          'text-1': { id: 'text-1', type: 'text', content: 'World' },
        },
      },
      elements: {
        'hero-1': { id: 'hero-1', type: 'container', x: 0, y: 0 },
        'text-1': { id: 'text-1', type: 'text', content: 'World' },
      },
    },
  },
  {
    name: 'Mixed format (Array at root, Object in canvas)',
    blocks: {
      canvas: {
        zoom: 1,
        elements: {
          'el-1': { id: 'el-1', type: 'button' },
        },
      },
      elements: [
        { id: 'el-1', type: 'button' },
      ],
    },
  },
];

// Load logic (same as PageBuilderEditor)
function loadElements(initialData: any) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${initialData.name}`);
  console.log(`${'='.repeat(60)}`);
  
  const blocks = initialData.blocks;
  let elementsObject: Record<string, any> = {};
  let loadedFrom = '';

  // Load elements - support both array and object format
  if (blocks.elements) {
    console.log('🧩 Found elements at root level');
    console.log(`   Type: ${Array.isArray(blocks.elements) ? 'Array' : 'Object'}`);
    
    if (Array.isArray(blocks.elements)) {
      blocks.elements.forEach((el: any) => {
        elementsObject[el.id] = el;
      });
      console.log(`   ✅ Converted array to object: ${Object.keys(elementsObject).length} elements`);
      loadedFrom = 'root (array → object)';
    } else if (typeof blocks.elements === 'object') {
      elementsObject = blocks.elements;
      console.log(`   ✅ Using object format: ${Object.keys(elementsObject).length} elements`);
      loadedFrom = 'root (object)';
    }
  }
  // Backup path
  else if (blocks.canvas?.elements) {
    console.log('🧩 Found elements in canvas.elements');
    console.log(`   Type: ${Array.isArray(blocks.canvas.elements) ? 'Array' : 'Object'}`);
    
    if (Array.isArray(blocks.canvas.elements)) {
      blocks.canvas.elements.forEach((el: any) => {
        elementsObject[el.id] = el;
      });
      console.log(`   ✅ Converted array to object: ${Object.keys(elementsObject).length} elements`);
      loadedFrom = 'canvas.elements (array → object)';
    } else if (typeof blocks.canvas.elements === 'object') {
      elementsObject = blocks.canvas.elements;
      console.log(`   ✅ Using object format: ${Object.keys(elementsObject).length} elements`);
      loadedFrom = 'canvas.elements (object)';
    }
  } else {
    console.log('⚠️  No elements found!');
  }

  // Result
  console.log(`\n📊 Result:`);
  console.log(`   Loaded from: ${loadedFrom}`);
  console.log(`   Elements count: ${Object.keys(elementsObject).length}`);
  console.log(`   Element IDs: ${Object.keys(elementsObject).join(', ')}`);
  
  if (Object.keys(elementsObject).length > 0) {
    console.log(`   ✅ SUCCESS - Elements loaded correctly`);
  } else {
    console.log(`   ❌ FAILED - No elements loaded`);
  }
  
  return elementsObject;
}

// Run tests
console.log('🧪 Testing Page Builder Load Logic\n');

testCases.forEach(testCase => {
  loadElements(testCase);
});

console.log(`\n${'='.repeat(60)}`);
console.log('✅ All tests completed!');
console.log(`${'='.repeat(60)}\n`);
