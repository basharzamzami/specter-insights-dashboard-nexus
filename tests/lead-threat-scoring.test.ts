/**
 * Lead Threat Scoring System - Comprehensive Unit Tests
 * Production-ready test suite with edge cases and performance testing
 */

import { assertEquals, assertExists, assertThrows } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { leadThreatScoreSystem } from "../supabase/functions/_shared/lead-threat-score-system.ts";

// Test data fixtures
const mockLeadData = {
  id: "test_lead_123",
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@testcorp.com",
  company_name: "Test Corp",
  title: "Marketing Director",
  industry: "Technology",
  company_size: 100,
  website_visits: 15,
  email_opens: 8,
  content_downloads: 3,
  demo_requested: true,
  pricing_page_visits: 5,
  stated_timeline: "3 months",
  multiple_stakeholders_engaged: true,
  demo_scheduled: false,
  recent_activity_spike: true,
  response_rate: 0.7,
  region: "North America",
  use_case: "Marketing Automation",
  stakeholder_count: 3
};

const mockConversationHistory = [
  {
    id: "conv_1",
    content: "We're evaluating marketing automation solutions and considering your platform along with HubSpot and Marketo.",
    channel: "email",
    timestamp: new Date("2024-01-15T10:00:00Z"),
    sentiment: 0.6,
    participants: ["john.doe@testcorp.com"]
  },
  {
    id: "conv_2", 
    content: "What's your pricing compared to HubSpot? They're offering us a significant discount.",
    channel: "phone",
    timestamp: new Date("2024-01-16T14:30:00Z"),
    sentiment: 0.3,
    participants: ["john.doe@testcorp.com", "sales@ourcompany.com"]
  },
  {
    id: "conv_3",
    content: "I need to present options to the board next week. Can you send me a detailed comparison?",
    channel: "email",
    timestamp: new Date("2024-01-17T09:15:00Z"),
    sentiment: 0.8,
    participants: ["john.doe@testcorp.com"]
  }
];

const mockCompetitorData = [
  {
    id: "comp_1",
    name: "HubSpot",
    market_share: 25,
    active_campaigns: 5,
    mentioned_in_conversations: true
  },
  {
    id: "comp_2",
    name: "Marketo",
    market_share: 15,
    active_campaigns: 3,
    mentioned_in_conversations: true
  }
];

// Test Suite: Basic Functionality
Deno.test("Lead Threat Scoring - Basic Calculation", async () => {
  const result = await leadThreatScoreSystem.calculateLeadThreatScore(
    mockLeadData,
    mockConversationHistory,
    mockCompetitorData
  );

  // Verify basic structure
  assertExists(result.lead_id);
  assertExists(result.overall_score);
  assertExists(result.threat_level);
  assertExists(result.scoring_factors);
  assertExists(result.threat_indicators);
  assertExists(result.recommended_actions);
  assertExists(result.dynamic_follow_up);
  assertExists(result.competitive_intelligence);

  // Verify score is within valid range
  assertEquals(result.overall_score >= 0 && result.overall_score <= 100, true);
  
  // Verify threat level is valid
  const validThreatLevels = ['low', 'medium', 'high', 'critical'];
  assertEquals(validThreatLevels.includes(result.threat_level), true);

  console.log(`✅ Basic calculation test passed - Score: ${result.overall_score}, Level: ${result.threat_level}`);
});

// Test Suite: Edge Cases
Deno.test("Lead Threat Scoring - Minimal Data", async () => {
  const minimalLead = {
    id: "minimal_lead",
    first_name: "Jane",
    last_name: "Smith",
    email: "jane@example.com",
    company_name: "Example Inc"
  };

  const result = await leadThreatScoreSystem.calculateLeadThreatScore(
    minimalLead,
    [],
    []
  );

  assertExists(result);
  assertEquals(result.overall_score >= 0, true);
  assertEquals(result.threat_level, 'low'); // Should default to low with minimal data

  console.log(`✅ Minimal data test passed - Score: ${result.overall_score}`);
});

Deno.test("Lead Threat Scoring - High Threat Scenario", async () => {
  const highThreatLead = {
    ...mockLeadData,
    demo_requested: true,
    demo_scheduled: true,
    pricing_page_visits: 20,
    recent_activity_spike: true,
    stated_timeline: "immediate",
    stakeholder_count: 5
  };

  const urgentConversations = [
    {
      id: "urgent_1",
      content: "We need to make a decision by Friday. HubSpot is pressuring us with a limited-time offer.",
      channel: "phone",
      timestamp: new Date(),
      sentiment: 0.2,
      participants: ["decision.maker@testcorp.com"]
    }
  ];

  const result = await leadThreatScoreSystem.calculateLeadThreatScore(
    highThreatLead,
    urgentConversations,
    mockCompetitorData
  );

  // Should be high or critical threat
  assertEquals(['high', 'critical'].includes(result.threat_level), true);
  assertEquals(result.overall_score >= 70, true);
  assertEquals(result.recommended_actions.escalation_required, true);

  console.log(`✅ High threat scenario test passed - Score: ${result.overall_score}, Level: ${result.threat_level}`);
});

// Test Suite: Scoring Factors
Deno.test("Lead Threat Scoring - Intent Strength Calculation", async () => {
  const highIntentLead = {
    ...mockLeadData,
    demo_requested: true,
    pricing_page_visits: 15,
    content_downloads: 8,
    stated_timeline: "1 month"
  };

  const result = await leadThreatScoreSystem.calculateLeadThreatScore(
    highIntentLead,
    mockConversationHistory,
    mockCompetitorData
  );

  // Intent strength should be high
  assertEquals(result.scoring_factors.intent_strength >= 70, true);

  console.log(`✅ Intent strength test passed - Intent Score: ${result.scoring_factors.intent_strength}`);
});

Deno.test("Lead Threat Scoring - Competitive Pressure Analysis", async () => {
  const competitiveConversations = [
    {
      id: "comp_conv_1",
      content: "HubSpot is offering us 40% off and Marketo has better integration capabilities.",
      channel: "email",
      timestamp: new Date(),
      sentiment: 0.1,
      participants: ["buyer@testcorp.com"]
    }
  ];

  const result = await leadThreatScoreSystem.calculateLeadThreatScore(
    mockLeadData,
    competitiveConversations,
    mockCompetitorData
  );

  // Competitive pressure should be high due to competitor mentions and pricing pressure
  assertEquals(result.scoring_factors.competitive_pressure >= 60, true);
  assertEquals(result.threat_indicators.competitor_mentions.length >= 2, true);

  console.log(`✅ Competitive pressure test passed - Pressure Score: ${result.scoring_factors.competitive_pressure}`);
});

// Test Suite: Dynamic Follow-up
Deno.test("Lead Threat Scoring - Dynamic Follow-up Planning", async () => {
  const result = await leadThreatScoreSystem.calculateLeadThreatScore(
    mockLeadData,
    mockConversationHistory,
    mockCompetitorData
  );

  assertExists(result.dynamic_follow_up.next_touchpoint);
  assertExists(result.dynamic_follow_up.channel);
  assertExists(result.dynamic_follow_up.message_type);

  // Next touchpoint should be in the future
  assertEquals(result.dynamic_follow_up.next_touchpoint > new Date(), true);

  // Channel should be valid
  const validChannels = ['email', 'phone', 'linkedin', 'sms'];
  assertEquals(validChannels.includes(result.dynamic_follow_up.channel), true);

  console.log(`✅ Dynamic follow-up test passed - Next: ${result.dynamic_follow_up.next_touchpoint}, Channel: ${result.dynamic_follow_up.channel}`);
});

// Test Suite: Competitive Intelligence
Deno.test("Lead Threat Scoring - Competitive Intelligence Generation", async () => {
  const result = await leadThreatScoreSystem.calculateLeadThreatScore(
    mockLeadData,
    mockConversationHistory,
    mockCompetitorData
  );

  assertExists(result.competitive_intelligence.likely_competitors);
  assertExists(result.competitive_intelligence.competitive_advantages);
  assertExists(result.competitive_intelligence.differentiation_points);
  assertExists(result.competitive_intelligence.objection_handling);

  // Should identify competitors from conversation
  assertEquals(result.competitive_intelligence.likely_competitors.length >= 1, true);
  assertEquals(result.competitive_intelligence.likely_competitors.includes("HubSpot"), true);

  console.log(`✅ Competitive intelligence test passed - Competitors: ${result.competitive_intelligence.likely_competitors.join(', ')}`);
});

// Test Suite: Performance and Scalability
Deno.test("Lead Threat Scoring - Performance Test", async () => {
  const startTime = performance.now();
  
  // Test with larger dataset
  const largeConversationHistory = Array.from({ length: 50 }, (_, i) => ({
    id: `conv_${i}`,
    content: `This is conversation ${i} about our evaluation process and competitor comparison.`,
    channel: i % 2 === 0 ? 'email' : 'phone',
    timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
    sentiment: Math.random(),
    participants: [`user${i}@testcorp.com`]
  }));

  const result = await leadThreatScoreSystem.calculateLeadThreatScore(
    mockLeadData,
    largeConversationHistory,
    mockCompetitorData
  );

  const endTime = performance.now();
  const executionTime = endTime - startTime;

  assertExists(result);
  assertEquals(executionTime < 5000, true); // Should complete within 5 seconds

  console.log(`✅ Performance test passed - Execution time: ${executionTime.toFixed(2)}ms`);
});

// Test Suite: Batch Processing
Deno.test("Lead Threat Scoring - Batch Processing", async () => {
  const leads = Array.from({ length: 10 }, (_, i) => ({
    ...mockLeadData,
    id: `batch_lead_${i}`,
    email: `lead${i}@testcorp.com`,
    website_visits: Math.floor(Math.random() * 20),
    email_opens: Math.floor(Math.random() * 10)
  }));

  const startTime = performance.now();
  const results = [];

  for (const lead of leads) {
    const result = await leadThreatScoreSystem.calculateLeadThreatScore(
      lead,
      mockConversationHistory,
      mockCompetitorData
    );
    results.push(result);
  }

  const endTime = performance.now();
  const totalTime = endTime - startTime;
  const avgTimePerLead = totalTime / leads.length;

  assertEquals(results.length, leads.length);
  assertEquals(avgTimePerLead < 1000, true); // Should average less than 1 second per lead

  console.log(`✅ Batch processing test passed - ${leads.length} leads in ${totalTime.toFixed(2)}ms (avg: ${avgTimePerLead.toFixed(2)}ms per lead)`);
});

// Test Suite: Error Handling
Deno.test("Lead Threat Scoring - Invalid Input Handling", async () => {
  // Test with null lead data
  try {
    await leadThreatScoreSystem.calculateLeadThreatScore(
      null as any,
      mockConversationHistory,
      mockCompetitorData
    );
    throw new Error("Should have thrown an error for null lead data");
  } catch (error) {
    assertEquals(error.message.includes("Lead data is required"), true);
  }

  // Test with missing required fields
  try {
    await leadThreatScoreSystem.calculateLeadThreatScore(
      { email: "test@example.com" } as any,
      mockConversationHistory,
      mockCompetitorData
    );
    throw new Error("Should have thrown an error for missing required fields");
  } catch (error) {
    assertEquals(error.message.includes("required"), true);
  }

  console.log(`✅ Error handling test passed`);
});

// Test Suite: Data Validation
Deno.test("Lead Threat Scoring - Data Validation", async () => {
  const invalidLead = {
    ...mockLeadData,
    email: "invalid-email", // Invalid email format
    company_size: -5, // Invalid company size
    website_visits: "not-a-number" as any // Invalid data type
  };

  const result = await leadThreatScoreSystem.calculateLeadThreatScore(
    invalidLead,
    mockConversationHistory,
    mockCompetitorData
  );

  // Should still return a result but with adjusted scoring
  assertExists(result);
  assertEquals(result.overall_score >= 0 && result.overall_score <= 100, true);

  console.log(`✅ Data validation test passed - Handled invalid data gracefully`);
});

// Test Suite: Caching and Expiration
Deno.test("Lead Threat Scoring - Score Expiration", async () => {
  const result = await leadThreatScoreSystem.calculateLeadThreatScore(
    mockLeadData,
    mockConversationHistory,
    mockCompetitorData
  );

  // Verify expiration date is set and in the future
  assertExists(result.expires_at);
  assertEquals(result.expires_at > result.calculated_at, true);
  assertEquals(result.expires_at > new Date(), true);

  // Verify expiration is reasonable (should be within 24-48 hours)
  const hoursUntilExpiration = (result.expires_at.getTime() - result.calculated_at.getTime()) / (1000 * 60 * 60);
  assertEquals(hoursUntilExpiration >= 12 && hoursUntilExpiration <= 48, true);

  console.log(`✅ Score expiration test passed - Expires in ${hoursUntilExpiration.toFixed(1)} hours`);
});

// Test Suite: Threat Level Consistency
Deno.test("Lead Threat Scoring - Threat Level Consistency", async () => {
  const testCases = [
    { score: 15, expectedLevel: 'low' },
    { score: 45, expectedLevel: 'medium' },
    { score: 78, expectedLevel: 'high' },
    { score: 92, expectedLevel: 'critical' }
  ];

  for (const testCase of testCases) {
    // Create lead data that should produce the target score
    const adjustedLead = {
      ...mockLeadData,
      id: `consistency_test_${testCase.score}`,
      // Adjust factors to influence score
      website_visits: testCase.score > 70 ? 25 : testCase.score > 40 ? 10 : 2,
      demo_requested: testCase.score > 60,
      pricing_page_visits: testCase.score > 50 ? 15 : 2
    };

    const result = await leadThreatScoreSystem.calculateLeadThreatScore(
      adjustedLead,
      testCase.score > 70 ? mockConversationHistory : [],
      testCase.score > 60 ? mockCompetitorData : []
    );

    // Verify threat level aligns with score ranges
    if (result.overall_score < 30) {
      assertEquals(result.threat_level, 'low');
    } else if (result.overall_score < 60) {
      assertEquals(result.threat_level, 'medium');
    } else if (result.overall_score < 80) {
      assertEquals(result.threat_level, 'high');
    } else {
      assertEquals(result.threat_level, 'critical');
    }
  }

  console.log(`✅ Threat level consistency test passed`);
});

// Test Suite: Integration Test
Deno.test("Lead Threat Scoring - Full Integration Test", async () => {
  console.log("🧪 Running full integration test...");

  // Test complete workflow
  const result = await leadThreatScoreSystem.calculateLeadThreatScore(
    mockLeadData,
    mockConversationHistory,
    mockCompetitorData
  );

  // Comprehensive validation
  const validations = [
    { check: () => result.lead_id === mockLeadData.id, name: "Lead ID match" },
    { check: () => result.overall_score >= 0 && result.overall_score <= 100, name: "Score range" },
    { check: () => ['low', 'medium', 'high', 'critical'].includes(result.threat_level), name: "Valid threat level" },
    { check: () => Object.keys(result.scoring_factors).length >= 5, name: "Scoring factors present" },
    { check: () => result.threat_indicators.competitor_mentions.length >= 0, name: "Competitor mentions tracked" },
    { check: () => result.recommended_actions.priority_level >= 1 && result.recommended_actions.priority_level <= 5, name: "Valid priority level" },
    { check: () => result.dynamic_follow_up.next_touchpoint instanceof Date, name: "Follow-up date valid" },
    { check: () => result.competitive_intelligence.likely_competitors.length >= 0, name: "Competitive intelligence generated" },
    { check: () => result.calculated_at instanceof Date, name: "Calculation timestamp" },
    { check: () => result.expires_at instanceof Date, name: "Expiration timestamp" }
  ];

  let passedValidations = 0;
  for (const validation of validations) {
    try {
      if (validation.check()) {
        passedValidations++;
        console.log(`  ✅ ${validation.name}`);
      } else {
        console.log(`  ❌ ${validation.name}`);
      }
    } catch (error) {
      console.log(`  ❌ ${validation.name}: ${error.message}`);
    }
  }

  assertEquals(passedValidations, validations.length);

  console.log(`✅ Full integration test passed - ${passedValidations}/${validations.length} validations successful`);
  console.log(`📊 Final Result: Score ${result.overall_score}, Level ${result.threat_level}`);
});

// Performance benchmark
Deno.test("Lead Threat Scoring - Performance Benchmark", async () => {
  console.log("⚡ Running performance benchmark...");

  const iterations = 100;
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    
    await leadThreatScoreSystem.calculateLeadThreatScore(
      { ...mockLeadData, id: `benchmark_${i}` },
      mockConversationHistory,
      mockCompetitorData
    );
    
    const end = performance.now();
    times.push(end - start);
  }

  const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const p95Time = times.sort((a, b) => a - b)[Math.floor(times.length * 0.95)];

  console.log(`📈 Performance Results (${iterations} iterations):`);
  console.log(`  Average: ${avgTime.toFixed(2)}ms`);
  console.log(`  Min: ${minTime.toFixed(2)}ms`);
  console.log(`  Max: ${maxTime.toFixed(2)}ms`);
  console.log(`  P95: ${p95Time.toFixed(2)}ms`);

  // Performance assertions
  assertEquals(avgTime < 500, true); // Average should be under 500ms
  assertEquals(p95Time < 1000, true); // 95th percentile should be under 1 second

  console.log(`✅ Performance benchmark passed`);
});
