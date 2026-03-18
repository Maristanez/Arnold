---
name: test-prompt
description: Test an LLM prompt template against Claude API and validate structured JSON output
user_invocable: true
arguments:
  - name: prompt_name
    description: "Name of the prompt to test (e.g. generate-program, create-profile, debrief-session)"
    required: true
---

# Test Prompt Skill

Test an LLM prompt template for the Arnold app and validate it returns correctly structured output.

## Steps

1. **Find the prompt template**: Look in `src/services/` for the relevant service that builds the prompt, or ask the user to specify the prompt text.

2. **Identify the expected output type**: Check `src/types/` for the TypeScript interface the response should match.

3. **Create sample input data** based on the prompt's requirements:
   - For profile generation: mock onboarding answers
   - For program generation: mock UserProfile + context
   - For debrief: mock completed session data
   Use realistic fitness data — not lorem ipsum.

4. **Build the test prompt** by:
   - Inserting the sample data into the prompt template
   - Ensuring the system message instructs Claude to return valid JSON
   - Including the target TypeScript interface in the prompt so Claude knows the exact shape

5. **Run the prompt** against the Claude API:
   - Use the Anthropic SDK (`@anthropic-ai/sdk`)
   - Model: `claude-sonnet-4-6` for testing (cost-effective)
   - Set `max_tokens` appropriately (1024 for profiles, 4096 for programs)
   - Log the full request and response

6. **Validate the response**:
   - Parse the JSON response
   - Check every required field is present and correctly typed
   - Check enum values are valid (e.g., fitness_identity must be one of the 6 types)
   - Check arrays are non-empty where expected (e.g., a program must have exercises)
   - Check numeric values are within sane ranges (e.g., sets between 1-10, reps between 1-100)

7. **Report results**:
   - Show the full JSON response formatted
   - List any validation errors or warnings
   - Rate the output quality: Does it make sense for a real user?
   - Suggest prompt improvements if output is weak

## Validation Rules

For **UserProfile** output:
- `fitness_identity` must be one of: beginner, general, bodybuilder, powerlifter, athletic, weight_loss
- `goals` array must be non-empty
- `constraints` should reflect any mentioned injuries/limitations

For **WorkoutProgram** output:
- Must have at least 3 training days
- Each day must have 3+ exercises
- Each exercise must have: name, sets (1-10), reps or rep range, RPE or intensity marker
- No duplicate exercises within same day
- Muscle groups should be balanced across the week

For **SessionDebrief** output:
- Must include natural-language feedback (1-3 sentences)
- Must include progression flags (increase/maintain/decrease) for each exercise
- Suggestions must be actionable and specific

## Example Test Run

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 2048,
  system: 'You are Arnold, an AI fitness coach. Return valid JSON only.',
  messages: [{
    role: 'user',
    content: `Generate a weekly program for this user:\n${JSON.stringify(sampleProfile)}\n\nReturn JSON matching this interface:\n${interfaceDefinition}`
  }],
});

const json = JSON.parse(response.content[0].text);
// Validate against expected shape...
```
