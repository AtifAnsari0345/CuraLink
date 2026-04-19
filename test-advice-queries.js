// Test script to verify advice query handling
const { expandQuery, detectIntent } = require('./curalink-backend/utils/queryExpander');

const testCases = [
  {
    disease: 'lung cancer',
    query: 'Can I take Vitamin D?',
    expected: { isAdviceQuery: true, entity: 'vitamin d' }
  },
  {
    disease: 'diabetes',
    query: 'Is turmeric good?',
    expected: { isAdviceQuery: true, entity: 'turmeric' }
  },
  {
    disease: 'type 2 diabetes',
    query: 'Should I take metformin?',
    expected: { isAdviceQuery: true, entity: 'metformin' }
  },
  {
    disease: 'obesity',
    query: 'Is keto diet safe?',
    expected: { isAdviceQuery: true, entity: 'keto diet' }
  },
  {
    disease: 'lung cancer',
    query: 'Latest treatment options',
    expected: { isAdviceQuery: false, entity: null }
  }
];

console.log('🧪 Testing Advice Query Handling\n');

testCases.forEach((testCase, index) => {
  const result = expandQuery({
    disease: testCase.disease,
    query: testCase.query,
    location: ''
  });

  const isAdviceQuery = result.isAdviceQuery;
  const entity = result.entity;

  const pass = 
    isAdviceQuery === testCase.expected.isAdviceQuery &&
    entity === testCase.expected.entity;

  const status = pass ? '✅' : '❌';
  
  console.log(`${status} Test ${index + 1}: "${testCase.query}"`);
  console.log(`   Disease: ${testCase.disease}`);
  console.log(`   Expected: isAdviceQuery=${testCase.expected.isAdviceQuery}, entity="${testCase.expected.entity}"`);
  console.log(`   Got:      isAdviceQuery=${isAdviceQuery}, entity="${entity}"`);
  
  if (!pass) {
    console.log(`   Intents: ${result.intents.join(', ')}`);
    console.log(`   Query: ${result.primaryQuery}`);
  }
  console.log();
});

console.log('✨ Test suite complete!');
