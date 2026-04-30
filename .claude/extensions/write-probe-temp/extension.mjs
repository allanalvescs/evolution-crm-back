// Extension: write-probe-temp
// Temporary probe for repository write capability

import { joinSession } from "@github/copilot-sdk/extension";

const session = await joinSession({
    tools: [
        {
            name: "write-probe-temp_example",
            description: "Example tool - replace with your implementation",
            parameters: { type: "object", properties: {} },
            // Set skipPermission: true if users should not be prompted before this tool runs
            // skipPermission: true,
            handler: async (args) => "Hello from write-probe-temp!",
        },
    ],
});
