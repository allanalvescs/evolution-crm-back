// Extension: plan-writer
// Writes plan.md content to docs/tasks/plan.md

import { joinSession } from "@github/copilot-sdk/extension";

const session = await joinSession({
    tools: [
        {
            name: "plan-writer_example",
            description: "Example tool - replace with your implementation",
            parameters: { type: "object", properties: {} },
            // Set skipPermission: true if users should not be prompted before this tool runs
            // skipPermission: true,
            handler: async (args) => "Hello from plan-writer!",
        },
    ],
});
